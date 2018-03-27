

Reduxigen
=======

[![Greenkeeper badge](https://badges.greenkeeper.io/joe-crick/Reduxigen.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/joe-crick/Reduxigen.svg?branch=master)](https://travis-ci.org/joe-crick/Reduxigen)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
![Current Version](https://img.shields.io/badge/version-0.0.1-green.svg)


Reduxigen - Making Redux simpler.

_NOTE_: Reduxigen is in _alpha_. It is not complete, nor production ready. There are several libraries out there that are somewhat similar. In contrast to Reduxigen, which sits on top of Redux (and React-Redux), these libs offer a redux-like approach to state management. They are all their own state containers (i.e., they do not use redux). Here are a few:
* [redux-zero](https://github.com/concretesolutions/redux-zero) 
* [Repatch](https://github.com/jaystack/repatch)
* [Socrates](https://github.com/matthewmueller/socrates)

Then, there's Rematch which, like Reduxigen, is a wrapper around Redux:
* [Rematch](https://github.com/rematch/rematch)

I think it's nice to have choices.

To see an example of Reduxigen in action, you can view this [test repository](https://github.com/joe-crick/book-my-hooptie)

Finally, the footprint. Right now, when compressed, Reduxigen weighs in at ~7.2 kb.

## TOC

<!-- TOC -->

- [TOC](#toc)
- [Summary](#summary)
- [Setup](#setup)
- [Configure](#configure)
- [API](#api)
- [Central Reducer](#central-reducer)
    - [Custom Reducers](#custom-reducers)
- [Connect](#connect)

<!-- /TOC -->

## Summary

"[Redux] is hard... Integrating React and Redux is going to make [your] architecture more complicated." - [Brian Holt](https://github.com/btholt)

Redux is a great state management system. There's a reason why it's the go to state management system. But, Redux is complex.

State management shouldn't be complex.

It's not just that writing all the Redux boilerplate is time consuming, and mind numbing. It's that having a lot of places to change when you need to update a field is simply too much. It's too easy to make mistakes---too easy to forget something in the long chain of required tasks.

The goal of Reduxigen is to change all that.

Reduxigen is a thin wrapper around `redux`, `react-redux`, `redux-thunk`, `redux-observable`, and an application's `reducer`. When using Reduxigen, you will rarely need to write a `reducer`, `thunk`, or an `observable`. Instead, Reduxigen exposes a set of `actions`. When you create an `action`, Reduxigen automatically creates the reducer for that `action`.

If you're not using React, but you are using Redux, you can still use Reduxigen. You can load just the files you need. There are three distribution files: `actions`, `connect`, and `index`. `actions` contains the reducer and all action methods. `connect` contains the `react-redux` connection method. `index` contains it all.

## Setup

### Install from NPM

If you don't have `react` and `redux` already installed, then you'll need to install them. The minimum install for this would be:

```js
npm i react react-dom redux react-redux
```

If your app is already configured to work with `react` and `redux`, all you have to do is install Reduxigen. It's not published to npm at the moment (it may be later), so if you want to play with it for now, you must install it from github.

```js
npm i https://github.com/joe-crick/simple-r.git
```

## Configure

Configuring Reduxigen is easy.

1. Create your default state:

```js
// file name: state.js

export default {
  // example state
  test: ""
}

```

2. Create your store:

```js
// file name: store.js

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk"; // If you're using thunks
import { rootReducer } from "Reduxigen/actions";
import DEFAULT from "state"; // Wherever your default state is

export default createStore(rootReducer(DEFAULT), applyMiddleware(thunk));
```

That's it. You're ready to go.

### Create Actions

Given the following component:

```js
// file name: test.jsx

import React from 'react';

const Test = ({test}) => <button>{test}</button>;

export default Test;

```

All you need to do to update the `redux` store from your component is create an action:

```js
// file name: test-actions.js

import { update } from 'Reduxigen/actions';

// Note that the value "test" corresponds to the "test" field in the state object.
export const setTest = update("test");

```
### Connect actions to your component

Import this action into your component, and connect it to `redux`, using Reduxigen's `connect` method, which simplifies mapping props and dispatch to state.

```js
// file name: test.jsx

import React from 'react';
import * as actions from './test-actions';
import connect from "Reduxigen/connect";

export const Test = ({test, setTest}) => <button onClick={setTest}>{test}</button>;

// method signature for bind -- bind(props, actions);
export default connect(['test'], actions)(Test);

```

Reduxigen's `connect` method will map the array of prop names you pass it to `mapStateToProps`. It will automatically map the actions you pass it to `mapDispatchToProps`.

## API

**actions:**
* [update](#update)
* [asyncUpdate](#asyncupdate)
* [action](action)
* [asyncAction](asyncaction)

**[central-reducer](#central-reducer):**
* A object-based rootReducer you can use when initializing `redux`.

**[connect](#connect):**
* a `connect` method that simplifies mapping props and dispatch to state.

### Functions

## update
### `update(field: string) => redux-action`

1. Creates a reducer for updating that field, if one does not exist, using a standard naming scheme based on the field name.
2. Creates and returns a redux-action.

#### Arguments

1. `field: string:` The field to update. This value will map to a field name on your state object. Reduxigen uses [`lodash/set`](https://lodash.com/docs/4.17.5#set) under the hood, so it supports any valid lodash setter path string.

#### Returns

`redux-action`: A valid redux action of the form: `{ type, payload }`.


#### Example

```js
// state

export default {
  pickup: "",
  nested: {
    value: ""
  }
}

```

```js
import { update } from "Reduxigen/actions";

export const setPickup = update("pickup");
export const setNested = update("nested.value");
```

`update` checks to see if its input value is a DOM `event`. If it detects one, it will automatically grab the `target.value` from that `event`.

```js
// example use

<input
  name="pickup"
  onChange={setPickup}
  value={pickup}
/>

<input
  name="nested-value"
  onChange={setNested}
  value={nested.value}
/>

```

You can also pass in the update value manually:

```js
// example use

<input
  name="pickup"
  onChange={setPickup('my custom update value')}
  value={pickup}
/>

```


## asyncUpdate
### `asyncUpdate(field: string, asyncOp: async Function [, fetchMethod: string]) => thunk`

The async operation can be any valid async function---a call to `fetch`, or `axios`, or `flavor-of-the-month`. If you're using `fetch`, because  getting data out of`fetch`is a two-step process, with options, you need to provide what type of data you are fetching.

`asyncUpdate` does the following:
1. Dispatches an `isLoading` action, which uses `update` to dynamically add  a loading property to your state associated with the field to update. This property has the form: `{field_name}_LOADING`. It is a Boolean property set to the appropriate loading state.
2. Dispatches a `hasError` action, which uses `update` to dynamicaly add an error property to your state associated with the field to update. This property has the form: `{field_name}_ERROR`. It is a Boolean property set to the appropriate error state.
3. If the data loads from the resource, then the loading state is updated to false, and an`update` is dispatched with the returned value.
4. If there is an error, then the error state is updated with the error returned.

#### Arguments

1. `field: string:` The field to update. Reduxigen supports uses `lodash/set` under the hood, so it supports any valid lodash setter path string.
2. `asyncOp: async function:` Any kind of async function is supported (fetch, axios, etc).
3. `fetchMethod: string: `_Optional_. If you're using `fetch`, supply the response data method you want to use. For example: `json`, `blob`, etc.

#### Returns

`thunk`: A redux thunk.

#### Example

```js
// state

export default {
  cars: []
}

```

```js
import { asnycUpdate } from "Reduxigen/actions";
import axios from "axios";

export const fetchCars = asyncUpdate("cars",  query => axios.get("http://cars.com/cars", query));
```

```js
// example use

class CarList extends Component {
  componentDidMount() {
    this.props.fetchCars(5);
  }

  render() {
    return (
      <div>
       { displayCars(this.props) }
      </div>
    )
  }
}

function displayCars({ cars, cars_loading, cars_error }) {
  if(cars_error) {
    return (<h1>An error has occurred</h1>);
  } else if(cars_loading) {
    return (<h1>Loading...</h1>);
  } else {
    return (
      <ul>
        { cars.map(car => <li key={car.id}>{car.name}</li> }
      </ul>
     );
  }
}

```


## action
### `action(name: string, func: function) => redux-action`

 Use an `action` when you need to do something other than a simple field update. For example, if you want to write a custom increment.

#### Arguments

1. `field: string:` The field to update. Reduxigen supports uses `lodash/set` under the hood, so it supports any valid lodash setter path string.
2. `func` a function that will be applied to the value passed to the reducer.

#### Returns

`redux-action`: A redux action of the form: `{ type, payload }`.

#### Example

```js
// state

export default {
  pickup: ""
}
```

```js
import { action } from "Reduxigen/actions";

export const setPickup = action("pickup", value => `${value}_woop!`);
```

```js
// example use

<input
  name="pickup"
  onChange={setPickup}
  value={pickup}
/>

```


## genericAction
### `genericAction(name: string, func: function) => (field: string) => redux-actiopn`

 Use a `genericAction` when you want to create an action that can use with multiple fields in your state. For example, if you want to write a custom increment, and use it as the update action for more than one part of your state.

#### Arguments

_base function_

1. `name` is used to create the reducer's method name. The method name is created by combining `name` with the `field`, e.g., `{field}_{name}`
2. `func` a function that will be applied to the value passed to the reducer.

_returned function_

3. `field: string:` The field to update. Reduxigen supports uses `lodash/set` under the hood, so it supports any valid lodash setter path string.

#### Returns

`redux-action`: A redux action of the form: `{ type, payload }`.

#### Example

```js
// state

export default {
  passengers: "",
  luggage: ""
}
```

```js
import { genericAction } from "Reduxigen/actions";

const increment = genericAction("increment", value => value + 1);

export const incrementPassengers = increment("passengers");
export const incrementLuggage = increment("luggage");
```

```js
// example use

<button onChange={incrementPassengers}>Add Passenger</button>
<button onChange={incrementLuggage}>Add Luggage</button>

```


## asyncAction
### `asyncAction(name: string, func: function, asyncOp: async function[, fetchMethod: string]) => thunk`

The `asyncOp` can be any async function, e.g., a call to `fetch`, or `axios`, or `flavor-of-the-month`. If you're using `fetch`, because  getting data out of`fetch`is a two-step process, with options, you need to provide what type of data you are fetching.

`asyncUpdate` does the following:
1. Dispatches an `isLoading` action, which uses `update` to dynamically add  a loading property to your state associated with the field to update. This property has the form: `{field_name}_LOADING`. It is a Boolean property set to the appropriate loading state.
2. Dispatches a `hasError` action, which uses `update` to dynamicaly add an error property to your state associated with the field to update. This property has the form: `{field_name}_ERROR`. It is a Boolean property set to the appropriate error state.
3. If the data loads from the resource, then the loading state is updated to false, and an`action` is dispatched with the returned value.
4. If there is an error, then the error state is updated with the error returned.

#### Arguments

1. `field: string:` The field to update. Reduxigen supports uses `lodash/set` under the hood, so it supports dot-delimited field identifier strings.
2. `func` is a function that will be run on the value when the reducer is called.
3. `asyncOp: async function:` Any kind of async function is supported (fetch, axios, etc).
4. `fetchMethod: string: `Optional. If you're using `fetch`, supply the response data method you want to use. For example: `json`, `blob`, etc.

#### Returns

`thunk`: A redux thunk.

#### Example

```jsx
import { asnycAction } from "Reduxigen/actions";
import axios from "axios";

export const updateDropoff = asyncAction(
  "dropoff",
  value => `${value}--hooptie!`,
  event => {
    const resourceId = event.target.value;
    return axios.get(`/dropoffs/${resourceId}`);
  }})
);
```


# Central Reducer

Reduxigen uses an object-based reducer. Using an object-based reducer instead of a `switch` based reducer allows reducers to be dynamically added. It has been noted that this type of reducer doesn't allow for case fallthrough (same state update for multiple actions). You can achieve the same end in Reduxigen by creating an `action`, which can be used with multiple state updates---or, because `update`s are independent actions, just reuse an `update`.

This is what Reduxigen's object-based reducer looks like:

```js
const REDUX_INIT = "@@redux/INIT";

export const reducers = {
  [REDUX_INIT]: state => state
};

export rootReducer = defaultState => (state = defaultState, action) => {
  const { type, payload } = action;
  if (reducers.hasOwnProperty(type)) {
    return reducers[type](state, payload);
  } else {
    throw new Error("Reducer not found");
  }
};
```
Each reducer `type` is a property on the object. The `reducer` function simply calls the function associated with that property when it receives an action. If no action is found, it throws an error.

## Custom Reducers

While Reduxigen dynamically creates your reducers for you, if you encounter a situation that Reduxigen can't support, no problem. You can still implement what you need to do the long way, and wire it up to Reduxigen's reducer. Here's an example of manually creating a reducer:

```js
// file name: without-Reduxigen.js
import { reducers } from 'Reduxigen/actions';

reducers.MY_ACTION = (var1, var2) => { // my code }
```
Once you've added the action to the reducer, you can create your action-creator, and dispatch it just the way you normally would in `react-redux`.

# Connect
Wiring up props and actions to a react component is a pain. Reduxigen's `connect` method aims to simplify this by doing the work for you. It does this by creating the `mapStateToProps` and `mapDispatchToProps` functions for you, then calling `react-redux`'s `connect` method.

```js
import * as actions from "./booking-actions";
import connect from "Reduxigen/connect";

// Your component here.

const stateMap = ["pickup", "dropoff", "pickupDate", "time", "cars", "cars_loading"];
export default connect(stateMap, actions)(Home);
```

`connect` supports nested properties. There are two ways to work with them. By default, `connect` will map nested propeties to nested properties. For example:

```js

const store = {
  test: {
    nested: {
      val: expected
    }
  }
};

const sampleComponent = props => (
  <h1>{props.test.nested.val}</h1>
);

export default connect(["test.nested.val"])(sampleComponent);

```

`connect` uses [`lodash/get`](https://lodash.com/docs/4.17.5#get) under the hood, so it supports any valid `lodash` getter path string.

Alternatively, you can create aliases for nested properties, using 'as' syntax:

```js
const store = {
  test: {
    nested: {
      val: "myVal"
    }
  }
};

const sampleComponent = props => (
  <h1>{props.val}</h1>
);

export default connect(["test.nested.val as val"])(sampleComponent);
```

Finally, it also supports functions. Passing functions can be useful when you want to display computed properties. `connect` injects the `state` into any function passed to it. It expects, therefore, that any function it works with will have one argument, `state`, in its method signature (e.g., `function myMethod(state) { }`). The following example demonstrates using a `reselect` selector:

**The Selector**
```js
import { createSelector } from 'reselect'
​
const getVisibilityFilter = state => state.visibilityFilter
const getTodos = state => state.todos
​
export const getVisibleTodos = createSelector(
  [getVisibilityFilter, getTodos],
  (visibilityFilter, todos) => {
    switch (visibilityFilter) {
      case 'SHOW_ALL':
        return todos
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
    }
  }
)
```

**The Connector**
To pass a function to `connect` add an object with one field to the array. The field name on the object will map to the field name in `props`.

```js
import { getVisibleTodos } from "../selectors";

const sampleComponent = ({todos}) => (
  <ul>
    {todos.map(todo => <li key={todo.id}>{todo.name}</li>}
  </ul>
);

export default connect([{todos: getVisibleTodos}])(sampleComponent);

```