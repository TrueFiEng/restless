# Restless

[![NPM](https://img.shields.io/npm/v/@restless/restless.svg)](https://www.npmjs.com/package/@restless/restless)
[![CircleCI](https://img.shields.io/circleci/build/github/EthWorks/restless/master.svg)](https://circleci.com/gh/EthWorks/restless/tree/master)
[![License](https://img.shields.io/github/license/Ethworks/restless.svg)](https://github.com/EthWorks/restless/blob/master/UNLICENSE)

Express.js api, validations and more.

1. Easy to write and read
2. Declarative
3. Type safe

```javascript
import express from 'express'
import { asyncHandler, responseOf, sanitize, asString } from 'restless'

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

## Api

1. `asyncHandler`
1. `responseOf`
1. `sanitize`
1. `asString`
1. `asNumber`
1. `asBoolean`
1. `asObject`
1. `asArray`
1. `asOptional`
1. `asChecked`
