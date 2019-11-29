<div align="center">
  <img width="250" src="https://raw.githubusercontent.com/EthWorks/restless/master/logo.png">
  <br>

[![NPM](https://img.shields.io/npm/v/@restless/sanitizers.svg)](https://www.npmjs.com/package/@restless/sanitizers)
[![CircleCI](https://img.shields.io/circleci/build/github/EthWorks/restless/master.svg)](https://circleci.com/gh/EthWorks/restless/tree/master)
[![License](https://img.shields.io/github/license/Ethworks/restless.svg)](https://github.com/EthWorks/restless/blob/master/UNLICENSE)

</div>

# Restless - Sanitizers

Functional data validation.

## Installation

```
npm install @restless/sanitizers
yarn add @restless/sanitizers
```

## Api

- [`cast`](#cast)
- [`asString`](#asstring)
- [`asNumber`](#assumber)
- [`asInteger`](#asinteger)
- [`asBoolean`](#asboolean)
- [`asMatching`](#asmatching)
- [`asObject`](#asobject)
- [`asArray`](#asarray)
- [`asOptional`](#asoptional)
- [`asChecked`](#aschecked)
- [`asMapped`](#asmapped)
- [`asFlatMapped`](#asflatmapped)
- [`asAnyOf`](#asanyof)
- [`withErrorMessage`](#witherrormessage)

### `cast`

Accepts a value and applies a sanitizer to it resulting in returning the sanitized value or throwing a TypeError.

```javascript
cast('123', asNumber) // 123
cast('foo', asNumber) // TypeError
```

### `asString`

Accepts any value that is a string. Returns a string.

```javascript
asString('asd', 'path') // Result.ok('asd')
asString(123, 'path') // Result.error([{expected: 'string', path: 'path'}])
```

### `asNumber`

Accepts any value that is a number or a string that represents a number. Returns a number.

```javascript
asNumber(123, 'path') // Result.ok(123)
asNumber('0.2', 'path') // Result.ok(0.2)
asNumber('boo', 'path') // Result.error([{expected: 'number', path: 'path'}])
asNumber({}, 'path') // Result.error([{expected: 'number', path: 'path'}])
```

### `asInteger`

Same as [`asNumber`](#asnumber), but does not accept floating point values.

```javascript
asInteger('123', 'path') // Result.ok(123)
asInteger(0.2, 'path') // Result.error([{expected: 'integer', path: 'path'}])
asInteger('boo', 'path') // Result.error([{expected: 'integer', path: 'path'}])
asInteger({}, 'path') // Result.error([{expected: 'integer', path: 'path'}])
```

### `asBoolean`

Accepts any value that is a number or a string that represents a boolean (`"true"` or `"false"`). Returns a number.

```javascript
asBoolean(true, 'path') // Result.ok(true)
asBoolean('false', 'path') // Result.ok(false)
asBoolean('boo', 'path') // Result.error([{expected: 'boolean', path: 'path'}])
asBoolean(123, 'path') // Result.error([{expected: 'boolean', path: 'path'}])
```

### `asMatching`

This higher-order sanitizer accepts values that are strings matching the regex provided as an argument. You can pass a custom message to it.

```javascript
const sanitizer = asMatching(/aaa/, 'custom message')

sanitizer('aaa', 'path') // Result.ok('aaa')
sanitizer(123, 'path') // Result.error([{expected: 'custom message', path: 'path'}])
sanitizer('b', 'path') // Result.error([{expected: 'custom message', path: 'path'}])
```

### `asObject`

This higher-order sanitizer requires a schema in the form of an object. Values of the schema are sanitizers used to sanitize the values of the input. Returns an object with keys and values matching the schema.

```javascript
const sanitizer = asObject({ foo: asNumber, bar: asString })

sanitizer({ foo: 1, bar: 'a' }, 'path') // Result.ok({ foo: 1, bar: 'a' })
sanitizer(123, 'path') // Result.error([{expected: 'object', path: 'path'}])
sanitizer({}, 'path')
// Result.error([
//   {expected: 'number', path: 'path.foo'},
//   {expected: 'string', path: 'path.bar'}
// ])
sanitizer({ foo: true, bar: 'a' , 'path') // Result.error([{expected: 'number', path: 'path.foo'}])
```

### `asArray`

This higher-order sanitizer accepts any value that is an array of items that are sanitized through the sanitizer passed as argument.

```javascript
const sanitizer = asArray(asNumber)

sanitizer([123, '45'], 'path') // Result.ok([123, 45])
sanitizer(123, 'path') // Result.error([{expected: 'array', path: 'path'}])
sanitizer([123, 'foo'], 'path') // Result.error([{expected: 'number', path: 'path[0]'}])
```

### `asOptional`

This higher-order sanitizer accepts undefined or null or any value that is sanitized through the sanitizer passed as argument.

```javascript
const sanitizer = asOptional(asString)

sanitizer('abcdef', 'path') // Result.ok('abcdef')
sanitizer(null, 'path') // Result.ok(undefined)
sanitizer(undefined, 'path') // Result.ok(undefined)
sanitizer(123, 'path') // Result.error([{expected: 'string', path: 'path'}])
```

### `asExactly`

This higher-order sanitizer accepts only exactly the same values as the reference provided. Values are compared using the triple-equals operator (`===`).
Works with strings, numbers, booleans, null, and undefined.

```javascript
const sanitizer = asExactly('foo')

sanitizer('foo', 'path') // Result.ok('foo')
sanitizer('bar', 'path') // Result.error([{expected: 'exactly "foo"', path: 'path'}])
``` 

### `asChecked`

This higher-order sanitizer accepts any value that is sanitized through the sanitizer passed as argument and satisfies the predicate passed as the second argument. A third argument that specifies an optional expected message can be provided

```javascript
const sanitizer = asChecked(asString, x => x.length > 3)

sanitizer('abcdef', 'path') // Result.ok('abcdef')
sanitizer(123, 'path') // Result.error([{expected: 'string', path: 'path'}])
sanitizer('a', 'path') // Result.error([{expected: 'custom logic', path: 'path'}])
```
```javascript
const sanitizer = asChecked(asString, x => x.length > 3, 'string longer than 3')
sanitizer('a', 'path') // Result.error([{expected: 'string longer than 3', path: 'path'}])
```

It also works with type guards in the same way as `Array.filter`:

```typescript
const asFoo: Sanitizer<'foo'> = asChecked(asString, (x): x is 'foo' => x === 'foo')
``` 

### `asMapped`

This higher-order sanitizer accepts any value that is sanitized through the sanitizer passed as argument. That value is then transformed using the provided function.

```javascript
const sanitizer = asMapped(asNumber, x => x > 1)

sanitizer(123, 'path') // Result.ok(true)
sanitizer(0, 'path') // Result.ok(false)
sanitizer('a', 'path') // Result.error([{expected: 'number', path: 'path'}])
```

### `asFlatMapped`

This higher-order sanitizer accepts any value that is sanitized through the sanitizer passed as argument. That value is then transformed using the provided function that can return Result a new value or an error.

```javascript
const sanitizer = asMapped(asNumber, (value, path) => x > 1
  ? Result.ok(value)
  : Result.error([{ path, expected: 'number > 1' }])
)

sanitizer(123, 'path') // Result.ok(123)
sanitizer(0, 'path') // Result.error([{expected: 'number > 1', path: 'path'}])
sanitizer('a', 'path') // Result.error([{expected: 'number', path: 'path'}])
```

### `asAnyOf`

This higher-order sanitizer accepts any value that is successfully sanitized through any of the sanitizers passed as an array argument. In case of multiple passing sanitizers, first one is used. A second argument specifies expected message.

```javascript
const sanitizer = asAnyOf([asNumber, asString], 'a string or a number')

sanitizer('abcdef', 'path') // Result.ok('abcdef')
sanitizer('123', 'path') // Result.ok(123)
sanitizer(123, 'path') // Result.ok(123)
sanitizer({}, 'path') // Result.error([{expected: 'a string or a number', path: 'path'}])
```

### `withErrorMessage`

This higher-order sanitizer will act just like the sanitizer passed as an argument, but will change the error value to contain a different `expected` message.

```javascript
const sanitizer = withErrorMessage(asString, 'bla bla')

sanitizer('abcdef', 'path') // Result.ok('abcdef')
sanitizer(123, 'path') // Result.error([{expected: 'bla bla', path: 'path'}])
```
