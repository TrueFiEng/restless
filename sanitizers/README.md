<div align="center">
  <img width="250" src="https://raw.githubusercontent.com/EthWorks/restless/master/logo.png">
  <br>

[![NPM](https://img.shields.io/npm/v/@restless/restless.svg)](https://www.npmjs.com/package/@restless/restless)
[![CircleCI](https://img.shields.io/circleci/build/github/EthWorks/restless/master.svg)](https://circleci.com/gh/EthWorks/restless/tree/master)
[![License](https://img.shields.io/github/license/Ethworks/restless.svg)](https://github.com/EthWorks/restless/blob/master/UNLICENSE)

</div>

# Restless - Sanitizers

Sanitizers for restless

## Installation

```
npm install @restless/sanitizers
yarn add @restless/sanitizers
```

## Api

- [`SanitizeError`](#sanitizeerror)
- [`asString`](#asstring)
- [`asNumber`](#assumber)
- [`asBoolean`](#asboolean)
- [`asMatching`](#asmatching)
- [`asObject`](#asobject)
- [`asArray`](#asarray)
- [`asOptional`](#asoptional)
- [`asChecked`](#aschecked)
- [`asMapped`](#asmapped)
- [`asFlatMapped`](#asflatmapped)
- [`asAnyOf`](#asanyof)

### `SanitizeError`

This is the error that is thrown when `sanitize` function receives data that does not match the schema.

### `asString`

Accepts any value that is a string. Returns a string.

```javascript
asString('asd') // RIGHT 'asd'
asString(123) // LEFT 'expected: string'
```

### `asNumber`

Accepts any value that is a number or a string that represents a number. Returns a number.

```javascript
asNumber(123) // RIGHT 123
asNumber('0.2') // RIGHT 0.2
asNumber('boo') // LEFT 'expected: number'
asNumber({}) // LEFT 'expected: number'
```

### `asBoolean`

Accepts any value that is a number or a string that represents a boolean (`"true"` or `"false"`). Returns a number.

```javascript
asBoolean(true) // RIGHT true
asBoolean('false') // RIGHT false
asBoolean('boo') // LEFT 'expected: boolean'
asBoolean(123) // LEFT 'expected: boolean'
```

### `asMatching`

This higher-order sanitizer accepts values that are strings matching the regex provided as an argument. You can pass a custom message to it.

```javascript
const sanitizer = asMatching(/aaa/, 'custom message')

sanitizer('aaa') // RIGHT 'aaa'
sanitizer(123) // LEFT 'expected: custom message'
sanitizer('b') // LEFT 'expected: custom message'
```

### `asObject`

This higher-order sanitizer requires a schema in the form of an object. Values of the schema are sanitizers used to sanitize the values of the input. Returns an object with keys and values matching the schema.

```javascript
const sanitizer = asObject({ foo: asNumber, bar: asString })

sanitizer({ foo: 1, bar: 'a' }) // RIGHT { foo: 1, bar: 'a' }
sanitizer(123) // LEFT 'expected: object'
sanitizer({}) // LEFT ['(.foo) expected: number', '(.bar) expected: string']
sanitizer({ foo: true, bar: 'a' ) // LEFT '(.foo) expected: number'
```

### `asArray`

This higher-order sanitizer accepts any value that is an array of items that are sanitized through the sanitizer passed as argument.

```javascript
const sanitizer = asArray(asNumber)

sanitizer([123, '45']) // RIGHT [123, 45]
sanitizer(123) // LEFT 'expected: array'
sanitizer([123, 'foo']) // LEFT '([0]) expected: number'
```

### `asOptional`

This higher-order sanitizer accepts undefined or null or any value that is sanitized through the sanitizer passed as argument.

```javascript
const sanitizer = asOptional(asString)

sanitizer('abcdef') // RIGHT 'abcdef'
sanitizer(null) // RIGHT undefined
sanitizer(undefined) // RIGHT undefined
sanitizer(123) // LEFT 'expected: string'
```

### `asChecked`

This higher-order sanitizer accepts any value that is sanitized through the sanitizer passed as argument and satisfies the predicate passed as the second argument. A third argument that specifies an optional expected message can be provided

```javascript
const sanitizer = asChecked(asString, x => x.length > 3)

sanitizer('abcdef') // RIGHT 'abcdef'
sanitizer(123) // LEFT 'expected: string'
sanitizer('a') // LEFT 'expected: custom logic'
```
```javascript
const sanitizer = asChecked(asString, x => x.length > 3, 'string longer than 3')
sanitizer('a') // LEFT 'expected: string longer than 3'
```

### `asMapped`

This higher-order sanitizer accepts any value that is sanitized through the sanitizer passed as argument. That value is then transformed using the provided function.

```javascript
const sanitizer = asMapped(asNumber, x => x > 1)

sanitizer(123) // RIGHT true
sanitizer(0) // RIGHT false
sanitizer('a') // LEFT 'expected: number'
```

### `asFlatMapped`

This higher-order sanitizer accepts any value that is sanitized through the sanitizer passed as argument. That value is then transformed using the provided function that can return either a new value or an error.

```javascript
const sanitizer = asMapped(asNumber, (value, path) => x > 1
  ? Either.right(value)
  : Either.left([{ path, expected: 'number > 1' }])
)

sanitizer(123) // RIGHT 123
sanitizer(0) // LEFT 'expected: number > 1'
sanitizer('a') // LEFT 'expected: number'
```

### `asAnyOf`

This higher-order sanitizer accepts any value that is successfully sanitized through any of the sanitizers passed as an array argument. In case of multiple passing sanitizers, first one is used. A second argument specifies expected message.

```javascript
const sanitizer = asAnyOf([asNumber, asString], 'a string or a number')

sanitizer('abcdef') // RIGHT 'abcdef'
sanitizer('123') // RIGHT 123
sanitizer(123) // RIGHT 123
sanitizer({}) // LEFT 'expected: a string or a number'
```

### `withErrorMessage`

This higher-order sanitizer will act just like the sanitizer passed as an argument, but will change the error value to contain a different `expected` message.

```javascript
const sanitizer = withErrorMessage(asString, 'bla bla')

sanitizer('abcdef') // RIGHT 'abcdef'
sanitizer(123) // LEFT 'expected: bla bla'
```
