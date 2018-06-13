import setField from "lodash.set";

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
export const set = field => input => {
  const type = createActionName(field);
  const payload = getPayload(input);
  if (!reducers.hasOwnProperty(type)) {
    reducers[type] = (state, value) => setField({ ...state }, field, value);
  }
  return {
    type,
    payload
  };
};

/**
 * For computed updates---for example, an increment
 * @param field
 * @param func
 * @param isSet
 * @return {function(*=): {type: string, payload: *}}
 */
export const update = (field, func) => input => {
  const type = createActionName(field, "UPDATE");
  const payload = getPayload(input);
  if (!reducers.hasOwnProperty(type)) {
    reducers[type] = applyUpdate(func);
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
export const asyncUpdate = (field, func, asyncOp, fetchMethod) => query => (dispatch, getState) => {
  dispatch(isLoading(field, true));
  dispatch(hasError(field, false));
  const actionToRun = update(field, func);
  return asyncOp(query)
    .then(data => (isFetch(fetchMethod, data) ? data[fetchMethod]() : data))
    .then(data => {
      dispatch(isLoading(field, false));
      dispatch(actionToRun(data));
    })
    .catch(error => dispatch(hasError(field, error)));
};

/**
 * For computed updates---for example, an increment
 * @param name
 * @param func
 * @return {function(*, *)}
 */
export const action = (name, func) => field => payload => {
  const type = createActionName(field, name.toUpperCase());
  if (!reducers.hasOwnProperty(type)) {
    reducers[type] = applyUpdate(field, func);
  }
  return {
    type,
    payload
  };
};

/**
 * Merges the result of a function into the state, and returns a new, updated state.
 * @param func
 * @return {function(*=, *=): any}
 */
function applyUpdate(func) {
  return (state, value) => Object.assign({}, state, func(value, state));
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
  return set(`${field}_loading`)(hasLoaded);
}

/**
 * Dispatch an update action to indicate that an error has occurred for a specific field
 * @param field
 * @param isError
 * @return {{type: string, payload: *}}
 */
function hasError(field, isError) {
  return set(`${field}_error`)(isError);
}
