![CI](https://github.com/defnot001/totp-generator-ts/actions/workflows/build.yml/badge.svg)
[![npm version](https://badge.fury.io/js/totp-generator-ts.svg)](https://badge.fury.io/js/totp-generator-ts)
[![NPM Downloads](https://img.shields.io/npm/dm/totp-generator-ts.svg)](https://www.npmjs.com/package/totp-generator-ts)

# Time-based one-time password generator (TOTP)

This package is heavily inspired by [bellstrand/totp-generator](https://github.com/bellstrand/totp-generator). It uses the [JsSHA package](https://www.npmjs.com/package/jssha) to generate one-time passwords described in [RFC 6238](https://www.rfc-editor.org/rfc/rfc6238).

Major benefits of this package are the usage of [Typescript](https://www.typescriptlang.org/) and [tsup](https://github.com/egoist/tsup) so it can provide a CommonJS and ESModule version. It also uses [zod](https://zod.dev/) as a validation library to parse user inputs.

To use this package, simply install is using [npm](https://docs.npmjs.com/about-npm), [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/).

```sh
npm install totp-generator-ts
```

You can look at the documentation in the code using documenting comments or follow this guide.

## Guide

This guide will only show the usage of this package with **Typescript** but it can also be used in any **Javascript** Application.

First, import the package into your program.

```ts
import { TokenGenerator } from 'totp-generator-ts';
```

Instantiate an object from the class, optionally passing configuration. The default settings are:

- SHA-1 Algorithm
- 30 second time-step size
- 6 digit tokens
- current time as the timestamp

You can change the values using the constructor or changing them later in your program.

```ts
const tokenGen = new TokenGenerator({
	algorithm: 'SHA-512',
	period: 60,
	digits: 8,
	timestamp: 1675325019,
});

tokenGen.digits = 6;
```

To generate a token, simply used the public function `getToken()` which takes a string as an argument.

The string has to be **at least** one character long (it should most definitly be longer) and can only contain **base32 characters** defined in [RFC 4684](https://datatracker.ietf.org/doc/html/rfc4648).

```ts
import { TokenGenerator } from 'totp-generator-ts';

const tokenGen = new TokenGenerator();

const token = tokenGen.getToken('JBSWY3DPEHPK3PXP');

console.log(token);
```

This package will validate all your inputs and throw errors accordingly.

Contrary to the specifications for the TOTP-Algorithm described in [RFC 6238](https://www.rfc-editor.org/rfc/rfc6238), this program does not support time values greater than a 32bit-integer and will therefore **NOT WORK** after the year 2038!

If you find any issues or have suggestions please make sure to report them on the [issue tracker](https://github.com/defnot001/totp-generator-ts/issues).

You can also write me an [email](mailto:defnot001@gmail.com) and/or join my [discord server](https://discord.gg/wmJ3WBYcZF).

Thank you for using my repository and good luck with your next secure program!
