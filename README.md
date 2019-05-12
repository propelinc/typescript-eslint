This is a fork of [this repo](https://github.com/typescript-eslint/typescript-eslint)

The reason we have forked this repo is to change the `isTypeScriptFile` function in `packages/eslint-plugin/dist/util/misc.js`. We have changed it to lint .vue files as well as the .ts and .tsx files it was linting before.

In order to push the changed code in this repo you must do the following:

1. Run `npm adduser` and log into your npm account
2. Run `lerna bootstrap` from the root of repo (you might need to globally install the npm packages lerna and yarn)
3. Change into the `packages/eslint-plugin` folder and run `npm publish --access public`
4. Run step three above in the `packages/parser` and `packages/typescript-estree` folder
