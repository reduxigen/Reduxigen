import { rootReducer as reducerInit, reducers, addReducers } from "../esm/action-creator/action-creator";

describe("reducers", () => {
  let rootReducer;

  beforeEach(() => {
    rootReducer = reducerInit({});
    delete reducers.SET_TEST;
  });

  it("should run a valid genericAction", () => {
    const expected = 1;
    const mock = jest.fn();
    reducers.SET_TEST = mock;
    rootReducer({}, { type: "SET_TEST", payload: "test" });
    const actual = mock.mock.calls.length;
    expect(actual).toEqual(expected);
  });

  it("should be able to integrate external reducers", () => {
    const expected = 1;
    const mock = jest.fn();
    const mockReducer = (state, action) => {
      switch (action.type) {
        case "ADD_TEST":
          mock();
          return { ...state, test: 1 };
        default:
          return state;
      }
    };
    addReducers([mockReducer]);
    rootReducer({test: 0}, { type: "ADD_TEST", payload: "test" });
    const actual = mock.mock.calls.length;
    expect(actual).toEqual(expected);
  });
});
