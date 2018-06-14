const ac = require('../index');
const reducerInit = ac.rootReducer;
const reducers = ac.reducers;
const addReducers = ac.addReducers;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

describe("reducers", function () {
  var rootReducer = void 0;

  beforeEach(function () {
    rootReducer = reducerInit({});
    delete reducers.SET_TEST;
  });

  it("should run a valid genericAction", function () {
    var expected = 1;
    var mock = jest.fn();
    reducers.SET_TEST = mock;
    rootReducer({}, { type: "SET_TEST", payload: "test" });
    var actual = mock.mock.calls.length;
    expect(actual).toEqual(expected);
  });

  it("should be able to integrate external reducers", function () {
    var expected = 1;
    var mock = jest.fn();
    var mockReducer = function mockReducer(state, action) {
      switch (action.type) {
        case "ADD_TEST":
          mock();
          return _extends({}, state, { test: 1 });
        default:
          return state;
      }
    };
    addReducers([mockReducer]);
    rootReducer({ test: 0 }, { type: "ADD_TEST", payload: "test" });
    var actual = mock.mock.calls.length;
    expect(actual).toEqual(expected);
  });
});
