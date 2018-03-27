import { update, asyncUpdate, action, genericAction, asyncAction, reducers } from "../esm/action-creator/action-creator";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

const mockStore = configureMockStore([thunk]);

function reducersCount(reducers) {
  return Object.keys(reducers).length;
}

describe("Action Creators", () => {

  describe("update", () => {

    afterEach(() => {
      delete reducers.SET_TYPE;
    });
    it("should return an action", () => {
      const expected = { payload: "value", type: "SET_TYPE" };
      const actual = update("type")("value");
      expect(actual).toEqual(expected);
    });
    it("should add a new reducer to the rootReducer if it doesn't already exist", () => {
      const expected = 2;
      update("type")("value");
      const actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should not add a new reducer to the rootReducer if it already exists", () => {
      const expected = 2;
      update("type")("value");
      update("type")("value");
      const actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should automatically grab the value from an event object passed in as an argument", () => {
      const expected = { payload: "value", type: "SET_TYPE" };
      const actual = update("type")({target: { value: "value"}});
      expect(actual).toEqual(expected);
    })
  });

  describe("async update", () => {
    afterEach(() => {
      delete reducers.SET_CARS_LOADING;
      delete reducers.SET_CARS_ERROR;
      delete reducers.SET_CARS;
    });
    it("should return a set of actions corresponding to the possible states of the asyncAction", () => {
      const store = mockStore();
      const expected = [
        { payload: true, type: "SET_CARS_LOADING" },
        { payload: false, type: "SET_CARS_ERROR" },
        { payload: false, type: "SET_CARS_LOADING" },
        { payload: [1, 2, 3], type: "SET_CARS" }
      ];
      const fetchCars = asyncUpdate("cars", () => new Promise(resolve => resolve([1, 2, 3])));
      return store.dispatch(fetchCars()).then(() => {
        const actual = store.getActions();
        expect(actual).toEqual(expected);
      });
    });
    it("should add new reducers to the rootReducer if they don't already exist", () => {
      const expected = 4;
      const store = mockStore();
      const fetchCars = asyncUpdate("cars", () => new Promise(resolve => resolve([1, 2, 3])));
      return store.dispatch(fetchCars()).then(() => {
        const actual = reducersCount(reducers);
        expect(actual).toEqual(expected);
      });
    });
    it("should not add a new reducer to the rootReducer if it already exists", () => {
      const expected = 4;
      const store = mockStore();
      const fetchCars = asyncUpdate("cars", () => new Promise(resolve => resolve([1, 2, 3])));
      return store.dispatch(fetchCars()).then(() => {
        store.dispatch(fetchCars()).then(() => {
          const actual = reducersCount(reducers);
          expect(actual).toEqual(expected);
        });
      });
    });
  });

  describe("action", () => {
    afterEach(() => {
      delete reducers.SET_TYPE;
    });

    const actionCallback = (state, pickup) => ({ ...state, pickup });

    it("should return an action", () => {
      const expected = { payload: "value", type: "SET_TYPE" };
      const actual = action("type", actionCallback)("value");
      expect(actual).toEqual(expected);
    });
    it("should add a new reducer to the rootReducer if it doesn't already exist", () => {
      const expected = 2;
      action("type", actionCallback)("value");
      const actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should not add a new reducer to the rootReducer if it already exists", () => {
      const expected = 2;
      const updateType = action("type", actionCallback);
      updateType("value");
      updateType("value");
      const actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
  });

  describe("genericAction", () => {
    afterEach(() => {
      delete reducers.UPDATE_TYPE;
    });

    const actionCallback = (state, pickup) => ({ ...state, pickup });

    it("should return an genericAction", () => {
      const expected = { payload: "value", type: "UPDATE_TYPE" };
      const actual = genericAction("update", actionCallback)("type")("value");
      expect(actual).toEqual(expected);
    });
    it("should add a new reducer to the rootReducer if it doesn't already exist", () => {
      const expected = 2;
      genericAction("update", actionCallback)("type")("value");
      const actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should not add a new reducer to the rootReducer if it already exists", () => {
      const expected = 2;
      const updateType = genericAction("update", actionCallback);
      updateType("type")("value");
      updateType("type")("value");
      const actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
  });

  describe("async action", () => {
    afterEach(() => {
      delete reducers.SET_CARS_LOADING;
      delete reducers.SET_CARS_ERROR;
      delete reducers.SET_CARS;
    });

    let updateDropoff;

    beforeEach(() => {
      updateDropoff = asyncAction(
        "dropoff",
        value => value + '_test',
        text => new Promise(resolve => resolve(text))
      );
    });

    it("should return a set of actions corresponding to the possible states of the asyncAction", () => {
      const store = mockStore();
      const expected = [{"payload": true, "type": "SET_DROPOFF_LOADING"}, {"payload": false, "type": "SET_DROPOFF_ERROR"}, {"payload": false, "type": "SET_DROPOFF_LOADING"}, {"payload": "test", "type": "SET_DROPOFF"}];
      return store.dispatch(updateDropoff('test')).then(() => {
        const actual = store.getActions();
        expect(actual).toEqual(expected);
      });
    });
    it("should add new reducers to the rootReducer if they don't already exist", () => {
      const expected = 4;
      const store = mockStore();
      return store.dispatch(updateDropoff('test')).then(() => {
        const actual = reducersCount(reducers);
        expect(actual).toEqual(expected);
      });
    });
    it("should not add a new reducer to the rootReducer if it already exists", () => {
      const expected = 4;
      const store = mockStore();
      return store.dispatch(updateDropoff('test')).then(() => {
        store.dispatch(updateDropoff('test')).then(() => {
          const actual = reducersCount(reducers);
          expect(actual).toEqual(expected);
        });
      });
    });
  });
});
