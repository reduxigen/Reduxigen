import { connect } from "react-redux";
import set from "lodash.set";
import get from "lodash.get";
import getProps from "../utils/get-props";

export default (stateMap, actions) => PassThroughComponent => {
  // Allow for function "overloading"
  // This permits connect to be called as: connect(actions), or connect(stateMap, actions)
  if (stateMap && !Array.isArray(stateMap) && !actions) {
    actions = stateMap;
    stateMap = null;
  }
  const delimiter = " as ";
  const props = stateMap || getProps(PassThroughComponent);
  const mapStateToProps = props
    ? state =>
        props.reduce((prev, cur) => {
          const newState = { ...prev };
          const prop = isObject(cur) ? getComputedProp(cur) : getProp(cur, delimiter);
          const val = isObject(cur) ? getComputedVal(cur, prop, state) : get(state, getVal(cur, delimiter));
          set(newState, prop, val);
          return newState;
        }, {})
    : null;

  const mapDispatchToProps = actions
    ? dispatch =>
        Object.keys(actions).reduce(
          (prev, cur) => ({
            ...prev,
            [cur]: args => dispatch(actions[cur](args))
          }),
          {}
        )
    : null;

  const args = compileConnectArgs(mapStateToProps, mapDispatchToProps);

  return connect.apply(null, args)(PassThroughComponent);
};

function compileConnectArgs(mapStateToProps, mapDispatchToProps) {
  const args = [];
  if (mapStateToProps) {
    args.push(mapStateToProps);
  }
  if (mapDispatchToProps) {
    args.push(mapDispatchToProps);
  }
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
