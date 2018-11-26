# FlexData MySql Reference Service

## Introduction

This reference FlexData consumes illustrates how to build a connector from Kinvey to a MySql database

## Installation

To use this FlexData Service, clone this GitHub repository, and install the associated dependencies:

```npm install```

To run locally, you must have node.js v6.x or greater.

This project uses the [Kinvey Flex SDK v3.1.2 or greater](https://www.npmjs.com/package/kinvey-flex-sdk).  Execute:

```node .```

## Dependencies

This DLC uses the following dependencies, in addition to the `kinvey-flex-sdk`:

* *mysql:* The MySql node.js Native Database Driver
* *config:* The node config module
* *async:* Library for higher-order functions and common patterns for asynchronous code

## Overview

The FlexData Service implements handlers for the following FlexData events:

* onGetAll
* onGetById
* onGetCount
* onInsert

All methods establish a connection to the MySql server:

```
this.pool = mysql.createPool(config.mysql);
```

 and execute a query:

```
  getTable(table, callback) {
    this._runQuery(`SELECT * from ${table}`, callback);
  }
```

The data returned in the response body is then formatted to conform with the FlexData API:
 * an array of JSON objects for `onGetAll`
 * a single object for `onGetById` and `onInsert`
 * an object with a single property `count` for `onGetCount`.

After transforming, we complete the FlexData request and return the results to the request pipeline for further processing:

```
complete().setBody(result).ok().next();
```
