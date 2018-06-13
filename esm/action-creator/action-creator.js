"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.action = exports.asyncUpdate = exports.update = exports.set = exports.addReducers = exports.rootReducer = exports.reducers = undefined;

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

var _reducers;

var _lodash = require("lodash.set");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var REDUX_INIT = "@@redux/INIT";
var INIT = "@@INIT";

var identity = function identity(self) {
  return self;
};

var reducers = exports.reducers = (_reducers = {}, _defineProperty(_reducers, REDUX_INIT, identity), _defineProperty(_reducers, INIT, identity), _reducers);

var _externalReducers = [];

/**
 * Reduxigen's Central Reducer
 * @param defaultState
 * @return {Function}
 */
var rootReducer = exports.rootReducer = function rootReducer(defaultState) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments[1];
    var type = action.type,
      payload = action.payload;

    var newState = {};
    var foundReducer = _externalReducers.some(function (reducer) {
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
};

/**
 * Allows external reducers to be combined with Reduxigen's Central Reducer
 * @param {Array} reducer
 */
var addReducers = exports.addReducers = function addReducers(reducer) {
  _externalReducers = _externalReducers.concat(reducer);
};

/**
 * Creates a simple update action---state field is updated to value
 * @param field
 * @return {function(*=): {type: string, payload: *}}
 */
var set = exports.set = function set(field) {
  return function (input) {
    var type = createActionName(field);
    var payload = getPayload(input);
    if (!reducers.hasOwnProperty(type)) {
      reducers[type] = function (state, value) {
        return (0, _lodash2.default)(_extends({}, state), field, value);
      };
    }
    return {
      type: type,
      payload: payload
    };
  };
};

/**
 * For computed updates---for example, an increment
 * @param field
 * @param func
 * @param isSet
 * @return {function(*=): {type: string, payload: *}}
 */
var update = exports.update = function update(field, func) {
  return function (input) {
    var type = createActionName(field, "UPDATE");
    var payload = getPayload(input);
    if (!reducers.hasOwnProperty(type)) {
      reducers[type] = applyUpdate(func);
    }
    return {
      type: type,
      payload: payload
    };
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
var asyncUpdate = exports.asyncUpdate = function asyncUpdate(field, func, asyncOp, fetchMethod) {
  return function (query) {
    return function (dispatch, getState) {
      dispatch(isLoading(field, true));
      dispatch(hasError(field, false));
      var actionToRun = update(field, func);
      return asyncOp(query).then(function (data) {
        return isFetch(fetchMethod, data) ? data[fetchMethod]() : data;
      }).then(function (data) {
        dispatch(isLoading(field, false));
        dispatch(actionToRun(data));
      }).catch(function (error) {
        return dispatch(hasError(field, error));
      });
    };
  };
};

/**
 * For computed updates---for example, an increment
 * @param name
 * @param func
 * @return {function(*, *)}
 */
var action = exports.action = function action(name, func) {
  return function (field) {
    return function (payload) {
      var type = createActionName(field, name.toUpperCase());
      if (!reducers.hasOwnProperty(type)) {
        reducers[type] = applyUpdate(field, func);
      }
      return {
        type: type,
        payload: payload
      };
    };
  };
};

/**
 * Merges the result of a function into the state, and returns a new, updated state.
 * @param func
 * @return {function(*=, *=): any}
 */
function applyUpdate(func) {
  return function (state, value) {
    return Object.assign({}, state, func(value, state));
  };
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
function createActionName(field) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "SET";

  return prefix + "_" + field.toUpperCase();
}

/**
 * Dispatch an update action indicating that a specific field is loading
 * @param field
 * @param hasLoaded
 * @return {{type: string, payload: *}}
 */
function isLoading(field, hasLoaded) {
  return set(field + "_loading")(hasLoaded);
}

/**
 * Dispatch an update action to indicate that an error has occurred for a specific field
 * @param field
 * @param isError
 * @return {{type: string, payload: *}}
 */
function hasError(field, isError) {
  return set(field + "_error")(isError);
}