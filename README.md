<div align="center">
  <img width="250" src="./logo.png">
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

## Api

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

## Responses

These are simple higher-order helper function used to construct responses. The `asyncHandler` requires that the last function passed to it returns a response.

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


## `sanitize`

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

## Sanitizers

### `asString`

Accepts any value that is a string. Returns a string.

```javascript
asString('asd') // OK 'asd'
asString(123) // FAIL (not a string)
```

### `asNumber`

Accepts any value that is a number or a string that represents a number. Returns a number.

```javascript
asNumber(123) // OK 123
asNumber('0.2') // OK 0.2
asNumber('boo') // FAIL (not a number)
asNumber({}) // FAIL (not a number)
```

### `asBoolean`

Accepts any value that is a number or a string that represents a boolean (`"true"` or `"false"`). Returns a number.

```javascript
asBoolean(true) // OK true
asBoolean('false') // OK false
asBoolean('boo') // FAIL (not a boolean)
asBoolean(123) // FAIL (not a boolean)
```

### `asMatching`

This higher-order sanitizer accepts values that are strings matching the regex provided as an argument. You can pass a custom message to it.

```javascript
const sanitizer = asMatching(/aaa/, 'custom message')

sanitizer('aaa') // OK 'aaa'
sanitizer(123) // FAIL (custom message)
sanitizer('b') // FAIL (custom message)
```

### `asObject`

This higher-order sanitizer requires a schema in the form of an object. Values of the schema are sanitizers used to sanitize the values of the input. Returns an object with keys and values matching the schema.

```javascript
const sanitizer = asObject({ foo: asNumber, bar: asString })

sanitizer({ foo: 1, bar: 'a' }) // OK { foo: 1, bar: 'a' }
sanitizer(123) // FAIL (not an object)
sanitizer({}) // FAIL (missing values)
sanitizer({ foo: true, bar: 'a' ) // FAIL (foo is not a number)
```

### `asArray`

This higher-order sanitizer accepts any value that is an array of items that are sanitized through the sanitizer passed as argument.

```javascript
const sanitizer = asArray(asNumber)

sanitizer([123, '45']) // OK [123, 45]
sanitizer(123) // FAIL (not an array)
sanitizer([123, 'foo']) // FAIL (2nd element does not sanitize as a number)
```

### `asOptional`

This higher-order sanitizer accepts undefined or null or any value that is sanitized through the sanitizer passed as argument.

```javascript
const sanitizer = asOptional(asString)

sanitizer('abcdef') // OK 'abcdef'
sanitizer(null) // OK null
sanitizer(undefined) // OK undefined
sanitizer(123) // FAIL (not a string or null or undefined)
```

### `asChecked`

This higher-order sanitizer accepts any value that is sanitized through the sanitizer passed as argument and satisfies the predicate passed as the second argument.

```javascript
const sanitizer = asChecked(asString, x => x.length > 3)

sanitizer('abcdef') // OK 'abcdef'
sanitizer(123) // FAIL (not a string)
sanitizer('a') // FAIL (too short)
```
