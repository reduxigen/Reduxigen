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
 * Destructuring is currently not supported.
 *
 * @param fn
 * @return {string[]}
 */
export default fn => {
  if (typeof fn === "function") {
    const fnString = isReactComponent(fn) ? fn.prototype.render.toString() : fn.toString();
    const propSet = fnString.match(MATCH_PROPS) || [];
    return removeDuplicateProperties(propSet);
  }
  throw new Error("This method expects a function or a class. Some other value was passed in, instead.");
};

/**
 * Removes duplicate properties from the property set using a hash method for easy and brevity.
 * @param propSet
 * @return {string[]}
 */
function removeDuplicateProperties(propSet) {
  const propHash = propSet.reduce((prev, cur) => {
    const propName = cur.replace(STRIP, "");
    prev[propName] = "";
    return prev;
  }, {});
  return Object.keys(propHash);
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
