const ac = require("../index");
const redux = require('redux');
const thunk = require('redux-thunk').default;

const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;

const update = ac.update,
  asyncUpdate = ac.asyncUpdate,
  action = ac.action,
  set = ac.set,
  reducers = ac.reducers,
  rootReducer = ac.rootReducer;

const store = createStore(rootReducer({}), applyMiddleware(thunk));

function reducersCount(reducers) {
  return Object.keys(reducers).length;
}

const actionCallback = (state, pickup) => ({ ...state,
  pickup
});

describe("Action Creators", function () {
  describe("set", function () {
    afterEach(function () {
      delete reducers.SET_TYPE;
    });
    it("should return an action", function () {
      var expected = {
        "payload": "value",
        "type": "SET_TYPE"
      };
      var actual = set("type")("value");
      expect(actual).toEqual(expected);
    });
    it("should add a new reducer to the rootReducer if it doesn't already exist", function () {
      var expected = 3;
      set("type")("value");
      var actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should not add a new reducer to the rootReducer if it already exists", function () {
      var expected = 3;
      set("type")("value");
      set("type")("value");
      var actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should automatically grab the value from an event object passed in as an argument", function () {
      var expected = {
        "payload": "value",
        "type": "SET_TYPE"
      };
      var actual = set("type")({
        target: {
          value: "value"
        }
      });
      expect(actual).toEqual(expected);
    });
  });

  describe('update', function () {
    afterEach(function () {
      delete reducers.ACTION_SET_TEST;
    });
    it("should return an action", function () {
      var expected = {
        "payload": "value",
        "type": "UPDATE_UPDATE"
      };
      var actual = update("update", actionCallback)("value");
      expect(actual).toEqual(expected);
    });
    it("should add a new reducer to the rootReducer if it doesn't already exist", function () {
      var expected = 4;
      update("type", actionCallback)("value");
      var actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should not add a new reducer to the rootReducer if it already exists", function () {
      var expected = 4;
      update("type", actionCallback)("value");
      update("type", actionCallback)("value");
      var actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should update multiple fields on the state", function () {
      var expected = {
        "payload": "12",
        "type": "UPDATE_TEST"
      };
      var updateType = update('test', function (state, pickup) {
        return {
          thing: state.type,
          pickup: pickup
        };
      });
      var actual = updateType('12');
      expect(actual).toEqual(expected);
    });
  });

  describe("action", function () {
    afterEach(function () {
      delete reducers.UPDATE_TYPE;
    });

    it("should return an action", function () {
      var expected = {
        payload: "value",
        type: "UPDATE_TYPE"
      };
      var actual = action("update", actionCallback)("type")("value");
      expect(actual).toEqual(expected);
    });
    it("should add a new reducer to the rootReducer if it doesn't already exist", function () {
      var expected = 5;
      action("update", actionCallback)("type")("value");
      var actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should not add a new reducer to the rootReducer if it already exists", function () {
      var expected = 5;
      var updateType = action("update", actionCallback);
      updateType("type")("value");
      updateType("type")("value");
      var actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
  });

  describe("asyncUpdate", function () {
    afterEach(function () {
      delete reducers.SET_CARS_LOADING;
      delete reducers.SET_CARS_ERROR;
      delete reducers.ACTION_CARS;
    });

    var updateDropoff = void 0;

    beforeEach(function () {
      updateDropoff = asyncUpdate("dropoff", function (text) {
        return new Promise(function (resolve) {
          return resolve(text);
        });
      }, function (value) {
        value: value + "_test";
      });
    });

    it("should return a set of actions corresponding to the possible states of the asyncUpdate", function () {
      var expected = {
        "dropoff_error": false,
        "dropoff_loading": false
      };
      return store.dispatch(updateDropoff("test")).then(function () {
        var actual = store.getState();
        expect(actual).toEqual(expected);
      });
    });
    it("should add new reducers to the rootReducer if they don't already exist", function () {
      var expected = 7;
      return store.dispatch(updateDropoff("test")).then(function () {
        var actual = reducersCount(reducers);
        expect(actual).toEqual(expected);
      });
    });
    it("should not add a new reducer to the rootReducer if it already exists", function () {
      var expected = 7;
      return store.dispatch(updateDropoff("test")).then(function () {
        store.dispatch(updateDropoff("test")).then(function () {
          var actual = reducersCount(reducers);
          expect(actual).toEqual(expected);
        });
      });
    });
    xit('should default to the id function if no data function is provided', function () {
      var setDropoff = asyncUpdate("id", function (text) {
        return new Promise(function (resolve) {
          return resolve(text);
        });
      });
      var expected = {
        "dropoff_error": false,
        "dropoff_loading": false,
        "id_error": false,
        "id_loading": false,
        "test": "test"
      };
      return store.dispatch(setDropoff({
        test: "test"
      })).then(function () {
        var actual = store.getState();
        expect(actual).toEqual(expected);
      });
    });
  });
});