

Reduxigen
=======

[![Greenkeeper badge](https://badges.greenkeeper.io/joe-crick/Reduxigen.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/joe-crick/Reduxigen.svg?branch=master)](https://travis-ci.org/joe-crick/Reduxigen)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
![Current Version](https://img.shields.io/badge/version-0.0.1-green.svg)

"[Redux] is hard... Integrating React and Redux is going to make [your] architecture more complicated." - [Brian Holt](https://github.com/btholt)

Reduxigen - Making Redux simpler.

No one likes writing Redux boilerplate. It’s time consuming, error prone, and boring. Thanks to Reduxigen, you don’t have to any more!

To see an example of Reduxigen in action, you can view this [example repository](https://github.com/joe-crick/book-my-hooptie)

## TOC

<!-- TOC -->

- [Summary](#summary)
- [Setup](#setup)
- [Quick Start](#quick-start)
- [API](#api)
- [Other Options](#other-options)

<!-- /TOC -->

## Summary

Reduxigen is a thin wrapper around `redux`, `react-redux`, `redux-thunk`, and an application's `reducer`. When using Reduxigen, you will rarely need to write a `reducer`, or `thunk`.

Working with state using Reduxigen involves three concepts:

* **Store**: A standard Redux store.
* **Actions**: Reduxigen exposes several `action` types that update the store.
* **View**: Reduxigen exposes a `connect` method that simplifies connecting state and methods to props.

The workhorse of Reduxigen is the `action`. When you create an `action`, Reduxigen manages the reducer and action-creator for that `action`.

If you're not using React, but you are using Redux, you can still use Reduxigen. You can load only the files you need. There are two distribution files: `actions`, and `connect`. `actions` contains Reduxigen's `central-reducer` and all `action` methods. `connect` contains the simplified `react-redux` `connect` method.

## Setup

### Install from NPM

If you don't have `react` and `redux` already installed, then you'll need to install them. The minimum install for this would be:

```js
npm i react react-dom redux react-redux
```

If you need to have async operations in your app, also install `redux-thunk`.

If your app is already configured to work with `react` and `redux`, all you have to do is install Reduxigen. It's not published to npm at the moment (it may be later), so if you want to try it, for now, you must install it from github.

```js
npm i https://github.com/joe-crick/Reduxigen.git
```

## Quick Start

Getting up and running with Reduxigen is easy.

### Configure

1. Create your default state:

```js
export default {
  test: ""
}

```

2. Create your store:

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
There are several libraries out there that work to simplify Redux. For more information on these options, please see the following [Blog Article]().