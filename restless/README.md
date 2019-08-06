<div align="center">
  <img width="250" src="https://raw.githubusercontent.com/EthWorks/restless/master/logo.png">
  <br>

[![NPM](https://img.shields.io/npm/v/@restless/restless.svg)](https://www.npmjs.com/package/@restless/restless)
[![CircleCI](https://img.shields.io/circleci/build/github/EthWorks/restless/master.svg)](https://circleci.com/gh/EthWorks/restless/tree/master)
[![License](https://img.shields.io/github/license/Ethworks/restless.svg)](https://github.com/EthWorks/restless/blob/master/UNLICENSE)

</div>

# Restless

Express.js api, validations and more.

1. Easy to write and read
2. Declarative
3. Type safe

```javascript
import express from 'express'
import { asyncHandler, responseOf, sanitize, asString } from '@restless/restless'

const app = express()
app.get('/add/:a/:b', asyncHandler(
  sanitize({
    a: asNumber,
    b: asNumber
  }),
  ({ a, b }) => responseOf(a + b)
))
```

Later:

```
GET /add/1/2 -> 200: 3
GET /add/foo/2 -> 400: { path: 'params.a', expected: 'number' }
```

## Installation

```
npm install @restless/restless
yarn add @restless/restless
```

## Api

- [`asyncHandler`](#asynchandler)
- [`responseOf`](#responseof)
- [`responseOfBuffer`](#responseofbuffer)
- [`sanitize`](#sanitize)
- [`SanitizeError`](#sanitizeerror)
- All of the [@restless/sanitizers](https://github.com/EthWorks/restless/tree/master/sanitizers) library

### `asyncHandler`

This function is essentially an async pipe. It takes a set of possibly async functions that are called with the return value of the previous function. It returns an express middleware that should be passed as a route handler to express.

Every function passed to `asyncHandler` takes two arguments:
1. Return value of the previous function (undefined in case of the first one)
2. The express Request object

Example:
```javascript
import express from 'express'
import { asyncHandler, responseOf } from '@restless/restless'

const app = express()
app.get('/:foo', asyncHandler(
  (_, request) => request.params.foo,
  (foo) => responseOf(`Param foo is: ${foo}`)
))
```

## Response functions

These are simple higher-order helper functions used to construct express responses. The `asyncHandler` requires that the last function passed to it returns a response function.

### `responseOf`

Used to send json data:
```javascript
responseOf({ foo: 'bar' }) // default 200 status
responseOf({ error: 'NOT_FOUND' }, 404) // custom status-code
```

### `responseOfBuffer`

Used to send binary data from `Buffer`, use the first argument to specify data type:
```javascript
responseOfBuffer('png', Buffer.from('ABC', 'ascii')) // default 200 status
responseOfBuffer('jpeg', Buffer.from('ABC', 'ascii'), 404) // custom status-code
```

### Custom responses

In order to create a custom response all you need to do is write a custom function for it. Let's see how to create a response function for rendering views. First we need to consult the [express documentation](https://expressjs.com/en/4x/api.html#res.render). There we see that in order to send a rendered view to the client we must call `res.render`. Writing a function for restless is now a piece of cake:

```typescript
import { ResponseFunction } from '@restless/restless'
import { Response } from 'express'

export const responseOfView = (view: string, locals?: any, status = 200): ResponseFunction =>
  res => res
    .status(status)
    .render(view, locals)
```

## Sanitization

This library exports all sanitizers from the [@restless/sanitizers](https://github.com/EthWorks/restless/tree/master/sanitizers) library.

### `sanitize`

The `sanitize` function is a transformer. It transforms the request into an object that matches a schema you provide. The keys in the provided schema correspond to the url parameters with the exception of `body` and `query` which correspond to the request body and parsed query string respectively.

`sanitize` returns a function that is to be passed to `asyncHandler`.

Example:
```javascript
import express from 'express'
import { asyncHandler, responseOf, asObject, asNumber } from '@restless/restless'

const app = express()
app.get('/:foo', asyncHandler(
  sanitize({
    foo: asNumber,
    body: asObject({
      bar: asNumber
    }),
    query: asObject({
      baz: asNumber
    })
  })
  (data) => responseOf(data)
))
```

For this declaration a valid request is as follows:

```
GET /123?baz=456 '{"bar":789}'
```

### `SanitizeError`

This is the error that is thrown when `sanitize` function receives data that does not match the schema.
