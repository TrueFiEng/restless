# Restless

Express.js api, validations and more.

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
