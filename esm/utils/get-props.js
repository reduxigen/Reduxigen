/**
 * Should match terms that fit the pattern: props*.xxx[.xxx...], where .xxx... is an infinitely repeating pattern
 * props : match the term "props"
 * \w* : match zero or more instances of any word char [a-zA-Z0-9_] (greedy)
 * \. : match a "."
 * ([\w]+\.)* : match any word of the form "xxx." zero or more times. (greedy)
 * [\w]+ : match a whole word
 * @type {RegExp}
 */
const MATCH_PROPS = /props\w*\.([\w]+\.)*[\w]+/gi;
/**
 * props : match the term "props"
 * \w*: match zero or more instances of any word char [a-zA-Z0-9_] (greedy)
 * \. : match a "."
 * @type {RegExp}
 */
const STRIP = /(props\w*)\./gi;

/**
 * Returns a collection of all properties used in the component. It works as follows:
 * For stateless-functional components, it converts the function to a string, and then it will
 * `match` every instance of `props.field`. Given that Babel can convert calls to `props.x` into `props*.x`
 * where * === a number (e.g., props2), we look for instances of `props*.`.
 *
 * For class-based functions, we grab the `render` function from the `prototype` and
 * convert it to a string. As above, we then `match` every instance of `props.x`.
 *
 * Note: The results of mapStateToProps must be a plain object, which will be merged into
 * the component’s props.
 *
 * Destructuring is currently not supported.
 *
 * @param fn
 * @return {string[]}
 */
export default fn => {
  if (typeof fn === "function") {
    const propSet = getRawPropertiesFromComponent(fn)
      .filter(removeDuplicateProperties);
    const baseProps = getBaseProperties(propSet);
    return propSet
      .filter(filterOutBaseProps(baseProps))
      .map(stripPropPrefix);
  }
  throw new Error(`This method expects a function or a class. Instead, it received: ${JSON.stringify(fn)}.`);
};

const stripPropPrefix = prop => prop.replace(STRIP, "");
const filterOutBaseProps = baseProps => prop => !baseProps.hasOwnProperty(prop);

/**
 * Returns an array of properties from a stringified function body
 * @return {*|Array}
 * @param {Function} fn
 */
function getRawPropertiesFromComponent(fn) {
  const fnString = reactComponentToString(fn);
  return fnString.match(MATCH_PROPS) || [];
}

/**
 * Converts a stateless functional component or React class' `render` function to string
 * @param fn
 * @return {string}
 */
function reactComponentToString(fn) {
  return isReactComponent(fn) ? fn.prototype.render.toString() : fn.toString();
}

/**
 * Removes simple duplicates from an array
 * @param elem
 * @param pos
 * @param arr
 * @return {boolean}
 */
const removeDuplicateProperties = (elem, pos, arr) => arr.indexOf(elem) === pos;

/**
 * Base properties are properties objects, for example in the object { target: { value: 1 } }
 * `target` would be a base property. `react-redux` expects properties to be explicitly named
 * in order to correctly map them. Additionally, mapStateToProps must return a POJO. If we don't
 * excise the base properties, then the specific properties required for the component will be
 * overridden.
 * @param propSet
 */
function getBaseProperties(propSet) {
  const delimiter = ".";
  return propSet.reduce((prev, cur) => {
    if (cur.includes(delimiter)) {
      const splitProp = cur.split(delimiter);
      const baseProp = splitProp.slice(0, splitProp.length - 1).join(delimiter);
      prev[baseProp] = "";
    }
    return prev;
  }, {});
}

/**
 * Determines whether or not a function is a React Component, by assuming that all React Components
 * will have a `render` method on their `prototype`.
 * @param fn
 * @return {boolean}
 */
function isReactComponent(fn) {
  return fn.prototype.hasOwnProperty("render");
}
