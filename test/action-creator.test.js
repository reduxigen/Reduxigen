import {
  update,
  asyncUpdate,
  action,
  set,
  reducers
} from "../esm/action-creator/action-creator";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

const mockStore = configureMockStore([thunk]);

function reducersCount(reducers) {
  return Object.keys(reducers).length;
}

const actionCallback = (state, pickup) => ({ ...state, pickup });

describe("Action Creators", () => {
  describe("set", () => {
    afterEach(() => {
      delete reducers.SET_TYPE;
    });
    it("should return an action", () => {
      const expected = {"payload": "value", "type": "SET_TYPE"};
      const actual = set("type")("value");
      expect(actual).toEqual(expected);
    });
    it("should add a new reducer to the rootReducer if it doesn't already exist", () => {
      const expected = 3;
      set("type")("value");
      const actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should not add a new reducer to the rootReducer if it already exists", () => {
      const expected = 3;
      set("type")("value");
      set("type")("value");
      const actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should automatically grab the value from an event object passed in as an argument", () => {
      const expected = {"payload": "value", "type": "SET_TYPE"};
      const actual = set("type")({ target: { value: "value" } });
      expect(actual).toEqual(expected);
    });
  });

  describe('update', () => {
    afterEach(() => {
      delete reducers.ACTION_SET_TEST;
    });
    it("should return an action", () => {
      const expected = {"payload": "value", "type": "UPDATE_UPDATE"};
      const actual = update("update", actionCallback)("value");
      expect(actual).toEqual(expected);
    });
    it("should add a new reducer to the rootReducer if it doesn't already exist", () => {
      const expected = 4;
      update("type", actionCallback)("value");
      const actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should not add a new reducer to the rootReducer if it already exists", () => {
      const expected = 4;
      update("type", actionCallback)("value");
      update("type", actionCallback)("value");
      const actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should update multiple fields on the state", () => {
      const expected = {"payload": "12", "type": "UPDATE_TEST"};
      const updateType = update('test', (state, pickup) => ({
        thing: state.type,
        pickup
      }));
      const actual = updateType('12');
      expect(actual).toEqual(expected);
    });
  });

  describe("action", () => {
    afterEach(() => {
      delete reducers.UPDATE_TYPE;
    });

    it("should return an action", () => {
      const expected = { payload: "value", type: "UPDATE_TYPE" };
      const actual = action("update", actionCallback)("type")("value");
      expect(actual).toEqual(expected);
    });
    it("should add a new reducer to the rootReducer if it doesn't already exist", () => {
      const expected = 5;
      action("update", actionCallback)("type")("value");
      const actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
    it("should not add a new reducer to the rootReducer if it already exists", () => {
      const expected = 5;
      const updateType = action("update", actionCallback);
      updateType("type")("value");
      updateType("type")("value");
      const actual = reducersCount(reducers);
      expect(actual).toEqual(expected);
    });
  });

  describe("asyncUpdate", () => {
    afterEach(() => {
      delete reducers.SET_CARS_LOADING;
      delete reducers.SET_CARS_ERROR;
      delete reducers.ACTION_CARS;
    });

    let updateDropoff;

    beforeEach(() => {
      updateDropoff = asyncUpdate("dropoff", value => {value: value + "_test"}, text => new Promise(resolve => resolve(text)));
    });

    it("should return a set of actions corresponding to the possible states of the asyncUpdate", () => {
      const store = mockStore();
      const expected = [{"payload": true, "type": "SET_DROPOFF_LOADING"}, {"payload": false, "type": "SET_DROPOFF_ERROR"}, {"payload": false, "type": "SET_DROPOFF_LOADING"}, {"payload": "test", "type": "UPDATE_DROPOFF"}];
      return store.dispatch(updateDropoff("test")).then(() => {
        const actual = store.getActions();
        expect(actual).toEqual(expected);
      });
    });
    it("should add new reducers to the rootReducer if they don't already exist", () => {
      const expected = 7;
      const store = mockStore();
      return store.dispatch(updateDropoff("test")).then(() => {
        const actual = reducersCount(reducers);
        expect(actual).toEqual(expected);
      });
    });
    it("should not add a new reducer to the rootReducer if it already exists", () => {
      const expected = 7;
      const store = mockStore();
      return store.dispatch(updateDropoff("test")).then(() => {
        store.dispatch(updateDropoff("test")).then(() => {
          const actual = reducersCount(reducers);
          expect(actual).toEqual(expected);
        });
      });
    });
  });
});
