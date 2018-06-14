

![logo](https://raw.githubusercontent.com/reduxigen/Reduxigen/master/reduxigen-logo.png) Reduxigen
=======

[![Greenkeeper badge](https://badges.greenkeeper.io/reduxigen/Reduxigen.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/reduxigen/Reduxigen.svg?branch=master)](https://travis-ci.org/reduxigen/Reduxigen)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
![Current Version](https://img.shields.io/badge/version-1.0.0-green.svg)

# Reduxigen

Reduxigen is a ridiculously simple state management system. Managing state in Reduxigen entails only two concepts:

* State

* Functions

State is a plain JavaScript object.

Reduxigen functions update values in the state.\*

Reduxigen is also ridiculously small. It's only ~250 loc.--2.1 kb compressed.

### Robust

Reduxigen is built on top of Redux. If you've used Redux, many of the concepts in Reduxigen will be very familiar. However, you'll find using Reduxigen much simpler than Redux. You'll write less code. The code you write will be predictable. This will make you more efficient, and less prone to error. At the same time, you'll get all the benefits Redux has to offer.

---

\* More accurately, Reduxigen functions create a new state with appropriately updated values.

If you'd like to follow a step-by-step tutorial on getting started with Reduxigen,
you can read this blog article: [Super Simple React/Redux Apps with Reduxigen: Step by Step](https://itnext.io/super-simple-react-redux-apps-with-reduxigen-step-by-step-16ef9b884dd3)

To see an example of Reduxigen in action, you can view this [example repository](https://github.com/reduxigen/contact-manager)

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

The Reduxigen API exposes a set of functions. There are four functions:

### Synchronous

* `update`
* `asyncUpdate`
* `action`
* `set`

## Setup

### Install from NPM

If you don't have `react` and `redux` already installed, then you'll need to install them. The minimum install for this would be:

```js
npm i react react-dom redux react-redux
```

If you need to have async operations in your app, also install `redux-thunk`.

If your app is already configured to work with `react` and `redux`, all you have to do is install Reduxigen. Reduxigen plays nicely with other Redux tools such as Redux Saga, or Redux Observable.

To install Reduxigen:

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
import { set } from 'reduxigen/actions';

// Note that the value "test" corresponds to the "test" field in the state object.
export const setTest = set("test");

```
### Connect actions to your component

Import this action into your component, and connect it.

```js
import React from 'react';
import {setTest} from './test-actions';
import {connect} from "react-redux";

export const Test = ({test, setTest}) => <button onClick={setTest}>{test}</button>;

const mapStateToProps = state => {test: state.test}

export default connect(mapStateToProps, {setTest})(Test);

```

## API

For full details on the Reduxigen API, please consult the [Reduxigen GitBook](https://joe-crick.gitbooks.io/reduxigen/content/).
