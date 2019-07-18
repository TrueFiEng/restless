<div align="center">
  <img width="250" src="https://raw.githubusercontent.com/EthWorks/restless/master/logo.png">
  <br>

[![NPM](https://img.shields.io/npm/v/@restless/ethereum.svg)](https://www.npmjs.com/package/@restless/ethereum)
[![CircleCI](https://img.shields.io/circleci/build/github/EthWorks/restless/master.svg)](https://circleci.com/gh/EthWorks/restless/tree/master)
[![License](https://img.shields.io/github/license/Ethworks/restless.svg)](https://github.com/EthWorks/restless/blob/master/UNLICENSE)

</div>

# Restless - Ethereum

Ethereum module for restless. Uses [ethers.js](https://docs.ethers.io/ethers.js/html/index.html). Provides utilities such as:

1. [`asEthAddress`](#asethaddress)
1. [`asBigNumber`](#asbignumber)

## Sanitizers

### `asEthAddress`

Accepts any string that represents a valid ethereum address. Checks the checksum if present. Returns a normalized representation.

```javascript
asEthAddress('0xA5fE...f213') // OK 0xA5fE...f213
asEthAddress('0xa5fe...f213') // OK 0xA5fE...f213
asEthAddress('bla bla bla') // FAIL (not an ethereum address)
asBigNumber(123) // FAIL (not a string)
```

### `asBigNumber`

Accepts any string or number that represents an integer. Converts the integer to a [BigNumber](https://docs.ethers.io/ethers.js/html/api-utils.html#big-numbers).

```javascript
asBigNumber('123') // OK BigNumber(123)
asBigNumber(456) // OK BigNumber(456)
asBigNumber(1.5) // FAIL (not an integer)
asBigNumber(true) // FAIL (not a string or number)
```
