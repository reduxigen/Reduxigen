import React from "react";
import { shallow, mount } from "enzyme";
import connect from "../esm/connected/connected";
import configureMockStore from "redux-mock-store";

const mockStore = configureMockStore();

describe("Connected", () => {
  it("should render a component without state or props", () => {
    const sampleComponent = () => <h1>Test</h1>;
    const Sut = connect()(sampleComponent);
    const store = mockStore({});
    expect(shallow(<Sut store={store} />));
  });
  it("should render a component with flat state", () => {
    const expected = "test";
    const sampleComponent = props => <h1 className="test">{props.test}</h1>;
    const Sut = connect(["test"])(sampleComponent);
    const store = mockStore({
      test: expected
    });
    const app = mount(<Sut store={store} />);
    const actual = app
      .children()
      .first()
      .prop("test");

    expect(actual).toEqual(expected);
  });
  it("should render a component with an aliased flat state", () => {
    const expected = "test";
    const sampleComponent = props => <h1 className="test">{props.alias}</h1>;
    const Sut = connect(["test as alias"])(sampleComponent);
    const store = mockStore({
      test: expected
    });
    const app = mount(<Sut store={store} />);
    const actual = app
      .children()
      .first()
      .prop("alias");

    expect(actual).toEqual(expected);
  });
  it("should render a component with nested state", () => {
    const expected = "test";
    const sampleComponent = props => (
      <h1 className="test">{props.test.nested.val}</h1>
    );
    const Sut = connect(["test.nested.val"])(sampleComponent);
    const store = mockStore({
      test: {
        nested: {
          val: expected
        }
      }
    });
    const app = mount(<Sut store={store} />);
    const actual = app
      .children()
      .first()
      .prop("test").nested.val;

    expect(actual).toEqual(expected);
  });
  it("should render a component with nested, aliased state", () => {
    const expected = "test";
    const sampleComponent = props => (
      <h1 className="test">{props.alias}</h1>
    );
    const Sut = connect(["test.nested.val as alias"])(sampleComponent);
    const store = mockStore({
      test: {
        nested: {
          val: expected
        }
      }
    });
    const app = mount(<Sut store={store} />);
    const actual = app
      .children()
      .first()
      .prop("alias");

    expect(actual).toEqual(expected);
  });
  it("should render a component with a state selector", () => {
    const expected = "test";
    const sampleComponent = props => <h1 className="test">{props.test}</h1>;
    const Sut = connect([{test: state => state.test}])(sampleComponent);
    const store = mockStore({
      test: expected
    });
    const app = mount(<Sut store={store} />);
    const actual = app
      .children()
      .first()
      .prop("test");

    expect(actual).toEqual(expected);
  });
  it("should render a component with actions", () => {
    const expected = true;
    const mock = jest.fn();
    const sampleComponent = props => <h1 className="test">{props.test}</h1>;
    const Sut = connect(null, { mock })(sampleComponent);
    const store = mockStore({});
    const app = mount(<Sut store={store} />);
    const mockProp = app
      .children()
      .first()
      .prop("mock");
    const actual = typeof mockProp === "function";

    expect(actual).toEqual(expected);
  });
});
