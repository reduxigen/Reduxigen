import { connect } from "react-redux";
import set from "lodash.set";
import get from "lodash.get";

export default (stateMap, actions) => PassThroughComponent => {
  const delimiter = " as ";
  const mapStateToProps = stateMap
    ? state =>
        stateMap.reduce((prev, cur) => {
          const newState = { ...prev };
          const prop = isObject(cur) ? getComputedProp(cur) : getProp(cur, delimiter);
          const val = isObject(cur) ? getComputedVal(cur, prop, state) : get(state, getVal(cur, delimiter));
          set(newState, prop, val);
          return newState;
        }, {})
    : undefined;

  const mapDispatchToProps = actions
    ? dispatch =>
        Object.keys(actions).reduce(
          (prev, cur) => ({
            ...prev,
            [cur]: args => dispatch(actions[cur](args))
          }),
          {}
        )
    : undefined;

  const args = compileConnectArgs(mapStateToProps, mapDispatchToProps);

  return connect.apply(null, args)(PassThroughComponent);
};

function compileConnectArgs(mapStateToProps, mapDispatchToProps) {
  const args = [];
  if (mapStateToProps) args.push(mapStateToProps);
  if (mapDispatchToProps) args.push(mapDispatchToProps);
  return args;
}

function isObject(cur) {
  return cur !== null && typeof cur === "object";
}

function first(arr) {
  return arr[0];
}

function second(arr) {
  return arr[1];
}

function getProp(cur, delimiter) {
  return cur.includes(delimiter) ? second(cur.split(delimiter)) : cur;
}

function getVal(cur, delimiter) {
  return cur.includes(delimiter) ? first(cur.split(delimiter)) : cur;
}

function getComputedProp(cur) {
  return first(Object.keys(cur));
}

function getComputedVal(cur, prop, state) {
  return cur[prop](state);
}
