

![logo](https://raw.githubusercontent.com/joe-crick/Reduxigen/master/reduxigen-logo.png) Reduxigen
=======

[![Greenkeeper badge](https://badges.greenkeeper.io/joe-crick/Reduxigen.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/joe-crick/Reduxigen.svg?branch=master)](https://travis-ci.org/joe-crick/Reduxigen)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2f65f8caa0d049b3bc270ae229f450f4)](https://www.codacy.com/app/joe-crick/Reduxigen?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=joe-crick/Reduxigen&amp;utm_campaign=Badge_Grade)
![Current Version](https://img.shields.io/badge/version-0.0.5-green.svg)

"[Redux] is hard... Integrating React and Redux is going to make [your] architecture more complicated." - [Brian Holt](https://github.com/btholt)

Reduxigen - Making powerful state management simple.

Reduxigen makes working with React and Redux ridiculously simple:

 * No action creators. 
 * No reducers. 
 * No mapStateToProps. 
 * No mapDispatchToProps. 
 
There are only functions that update your state, and a powerful, simple `connect` method that wires everything up. 

To see an example of Reduxigen in action, you can view this [example repository](https://github.com/joe-crick/book-my-hooptie)

To read about Reduxigen in depth, please consult the [Reduxigen GitBook](https://joe-crick.gitbooks.io/reduxigen/content/).

## TOC

<!-- TOC -->

- [Summary](#summary)
- [Setup](#setup)
- [Quick Start](#quick-start)
- [API](#api)
- [Other Options](#other-options)

<!-- /TOC -->

## Summary

Reduxigen is a set of utilities: `actions` and `connect`. 

#### Actions

Reduxigen `actions` simplify the process of updating Redux state. They eliminate the need to write all the boilerplate of reducers and action-creators. 

#### Connect

Reduxigen `connect` simplifies connecting state and methods to props when using `react-redux`.

#### Use what you need

Each utility is its own file (`reduxigen/actions` and `reduxigen/connect`). You can load only the files you need. `actions` contains Reduxigen's `central-reducer` and all `action` methods. `connect` contains the simplified `react-redux` `connect` method.

## Setup

### Install from NPM

If you don't have `react` and `redux` already installed, then you'll need to install them. The minimum install for this would be:

```js
npm i react react-dom redux react-redux
```

If you need to have async operations in your app, also install `redux-thunk`.

If your app is already configured to work with `react` and `redux`, all you have to do is install Reduxigen.

```js
npm i reduxigen
```

## Quick Start

Getting up and running with Reduxigen is easy.

### Configure

1. Create a default state:

```js
export default {
  test: ""
}

```

2. Create a store:

```js
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk"; // If you're using thunks
import { rootReducer } from "reduxigen/actions";
import DEFAULT from "state";

export default createStore(rootReducer(DEFAULT), applyMiddleware(thunk));
```

### Create Actions

```js
import { update } from 'reduxigen/actions';

// Note that the value "test" corresponds to the "test" field in the state object.
export const setTest = update("test");

```
### Connect actions to your component

Import this action into your component, and connect it to `redux`, using Reduxigen's `connect` method, which simplifies mapping props and dispatch to state.

```js
import React from 'react';
import * as actions from './test-actions';
import connect from "reduxigen/connect";

export const Test = ({test, setTest}) => <button onClick={setTest}>{test}</button>;

export default connect(['test'], actions)(Test);

```

Reduxigen's `connect` method will map the array of prop names you pass it to `mapStateToProps`. It will automatically map the actions you pass it to `mapDispatchToProps`.

## API

For full details on the Reduxigen API, please consult the [Reduxigen GitBook](https://joe-crick.gitbooks.io/reduxigen/content/).

## Other Options
There are several libraries out there that work to simplify Redux. For more information on these options, please see the following [Blog Article](https://medium.com/@joseph0crick/redux-simplifiers-an-overview-46f4aac0908e).