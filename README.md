# @swanide/eslint-plugin-swan

eslint plugin for swan program.

support codes:

- `swan` Baidu smart program tpl language
- `sjs` JavasSript code

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `@swanide/eslint-plugin-swan`:

```
$ npm install @swanide/eslint-plugin-swan --save-dev
```

## Bin

Install `@swanide/eslint-plugin-swan` global.

```
$ npm install eslint @swanide/eslint-plugin-swan -g
```

Use `swan-lint` to lint mini program project.

```
$ swan-lint .
```
Use different lint level.

```
$ SWAN_LINT_CONFIG=[base|recommended|strict] swan-lint .
```

- `base` basic lint rules, must be fixed
- `recommended` recommended lint rules
- `strict` strict lint rules

## Usage

Add `swan` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "@swanide/swan"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@swanide/swan/valid-bind": 2
    }
}
```

## Supported Rules

- [array-bracket-spacing](./docs/rules/array-bracket-spacing.md)
- [comment-directive](./docs/rules/comment-directive.md)
- [dot-location](./docs/rules/dot-location.md)
- [dot-notation](./docs/rules/dot-notation.md)
- [html-end-tag](./docs/rules/html-end-tag.md)
- [key-spacing](./docs/rules/key-spacing.md)
- [no-confusing-for-if](./docs/rules/no-confusing-for-if.md)
- [no-duplicate-attributes](./docs/rules/no-duplicate-attributes.md)
- [no-parsing-error](./docs/rules/no-parsing-error.md)
- [no-useless-concat](./docs/rules/no-useless-concat.md)
- [no-useless-mustache](./docs/rules/no-useless-mustache.md)
- [valid-bind](./docs/rules/valid-bind.md)
- [valid-component-nesting](./docs/rules/valid-component-nesting.md)
- [valid-elif](./docs/rules/valid-elif.md)
- [valid-else](./docs/rules/valid-else.md)
- [valid-for](./docs/rules/valid-for.md)
- [valid-if](./docs/rules/valid-if.md)
