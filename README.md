# Restless

Build straightforward rest apis.

```javascript
import express from 'express'
import bodyParser from 'body-parser'
import { asyncHandler, responseOf, sanitize, asString } from 'restless'

const app = express()
app.use(bodyParser.json())

app.get('/users/:name', asyncHandler(
  // Check and sanitize incoming data
  sanitize({ name: asString }),
  // Type inference for input data. `name` is known to be a string
  ({ name }) => responseOf('Hello ' + name)
))
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
