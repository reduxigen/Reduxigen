import set from "lodash.set";

const REDUX_INIT = "@@redux/INIT";
const INIT = "@@INIT";

const identity = self => self;

export const reducers = {
  [REDUX_INIT]: identity,
  [INIT]: identity
};

let _externalReducers = [];

/**
 * Reduxigen's Central Reducer
 * @param defaultState
 * @return {Function}
 */
export const rootReducer = defaultState => (state = defaultState, action) => {
  const { type, payload } = action;
  let newState = {};
  const foundReducer = _externalReducers.some(reducer => {
    newState = reducer(state, action);
    return state !== newState;
  });
  if (foundReducer) {
    return newState;
  } else if (reducers.hasOwnProperty(type)) {
    return reducers[type](state, payload);
  } else {
    return state;
  }
};

/**
 * Allows external reducers to be combined with Reduxigen's Central Reducer
 * @param {Array} reducer
 */
export const addReducers = reducer => {
  _externalReducers = _externalReducers.concat(reducer);
};

/**
 * Creates a simple update action---state field is updated to value
 * @param field
 * @return {function(*=): {type: string, payload: *}}
 */
export const update = field => input => {
  const type = createActionName(field);
  const payload = getPayload(input);
  if (!reducers.hasOwnProperty(type)) {
    reducers[type] = (state, value) => set({ ...state }, field, value);
  }
  return {
    type,
    payload
  };
};

/**
 * Simple async update action---state field is updated to a value
 * @param field
 * @param asyncOp
 * @param fetchMethod
 * @return {function(*=, *=): function(*)}
 */
export const asyncUpdate = (field, asyncOp, fetchMethod) => query => dispatch => {
  dispatch(isLoading(field, true));
  dispatch(hasError(field, false));
  return asyncOp(query)
    .then(data => (isFetch(fetchMethod, data) ? data[fetchMethod]() : data))
    .then(data => {
      dispatch(isLoading(field, false));
      dispatch(update(field)(data));
    })
    .catch(error => dispatch(hasError(field, error)));
};

/**
 * For computed updates---for example, an increment
 * @param field
 * @param func
 * @param isSet
 * @return {function(*=): {type: string, payload: *}}
 */
export const action = (field, func, isSet = false) => input => {
  const type = createActionName(field, isSet ? "ACTION_SET" : "ACTION");
  const payload = getPayload(input);
  if (!reducers.hasOwnProperty(type)) {
    reducers[type] = isSet ? applyActionSet(func) : applyAction(field, func);
  }
  return {
    type,
    payload
  };
};

/**
 * For updating multiple properties in state
 * @param name
 * @param func
 * @return {function(*=): {type: string, payload: *}}
 */
export const actionSet = (name, func) => action(name, func, true);

/**
 * For computed updates---for example, an increment
 * @param name
 * @param func
 * @return {function(*, *)}
 */
export const genericAction = (name, func) => field => payload => {
  const type = createActionName(field, name.toUpperCase());
  if (!reducers.hasOwnProperty(type)) {
    reducers[type] = applyAction(field, func);
  }
  return {
    type,
    payload
  };
};

/**
 * Like an action, but asynchronous
 * @param field
 * @param func
 * @param asyncOp
 * @param fetchMethod
 * @param isSet
 * @return {function(*=): function(*, *): (Promise|*|Promise<T>)}
 */
export const asyncAction = (field, func, asyncOp, fetchMethod, isSet = false) => query => (dispatch, getState) => {
  dispatch(isLoading(field, true));
  dispatch(hasError(field, false));
  const actionToRun = isSet ? actionSet(field, func) : action(field, func);
  return asyncOp(query)
    .then(data => (isFetch(fetchMethod, data) ? data[fetchMethod]() : data))
    .then(data => {
      dispatch(isLoading(field, false));
      dispatch(actionToRun(data));
    })
    .catch(error => dispatch(hasError(field, error)));
};

/**
 * Runs an asynchronous action set
 * @param name
 * @param func
 * @param asyncOp
 * @param fetchMethod
 * @return {function(*=): function(*, *): (Promise|*|Promise<T>)}
 */
export const asyncActionSet = (name, func, asyncOp, fetchMethod) => asyncAction(name, func, asyncOp, fetchMethod, true);

/**
 * Merges the result of a function into the state, and returns a new, updated state.
 * @param func
 * @return {function(*=, *=): any}
 */
function applyActionSet(func) {
  return (state, value) => Object.assign({}, state, func(value, state));
}

/**
 * Applies an action to a state update
 * @param field
 * @param func
 * @return {function(*, *=): Object}
 */
function applyAction(field, func) {
  return (state, value) => set({ ...state }, field, func(value, state));
}

/**
 * Gets the payload from an event object, if one exists
 * @param payload
 * @return {*}
 */
function getPayload(payload) {
  return isEventObject(payload) ? payload.target.value : payload;
}

/**
 * Duck tyoe to determine whether or not this is an event object
 * @param payload
 * @return {*}
 */
function isEventObject(payload) {
  return payload && payload.target && payload.target.hasOwnProperty("value");
}

/**
 * Determine whether or not the asyncOp is a fetch, based on whether or not the fetch data access
 * method passed in exists---and, if so, if it is a function.
 * @param fetchMethod
 * @param data
 * @return {boolean}
 */
function isFetch(fetchMethod, data) {
  return fetchMethod && data && fetchMethod in data && typeof data[fetchMethod] === "function";
}

/**
 * Create a default action name
 * @param field
 * @param prefix
 * @return {string}
 */
function createActionName(field, prefix = "SET") {
  return `${prefix}_${field.toUpperCase()}`;
}

/**
 * Dispatch an update action indicating that a specific field is loading
 * @param field
 * @param hasLoaded
 * @return {{type: string, payload: *}}
 */
function isLoading(field, hasLoaded) {
  return update(`${field}_loading`)(hasLoaded);
}

/**
 * Dispatch an update action to indicate that an error has occurred for a specific field
 * @param field
 * @param isError
 * @return {{type: string, payload: *}}
 */
function hasError(field, isError) {
  return update(`${field}_error`)(isError);
}
