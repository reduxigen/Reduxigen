import { connect } from "react-redux";
import set from "lodash.set";
import get from "lodash.get";
import getProps from "../utils/get-props";
import { first, second } from "../utils/list-methods";
import isObject from "../utils/is-object";

export default (stateMap, actions, mergeProps, options) => PassThroughComponent => {
  // Allow for function "overloading"
  // This permits connect to be called as: connect(), connect(stateMap), connect(actions),
  // or connect(stateMap, actions)
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

  return connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(PassThroughComponent);
};

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
