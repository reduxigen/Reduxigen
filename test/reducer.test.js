import { rootReducer as reducerInit, reducers } from "../esm/action-creator/action-creator";

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

  it("should throw is passed an invalid genericAction", () => {
    expect(() => rootReducer({}, { type: "SET_TEST", payload: "test" })).toThrow();
  });
});
