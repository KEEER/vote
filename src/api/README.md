Vote API
========

This is the Vote public API package, currently work in progress. Deeply inspired by the
[Vue function API][vue-function-api]. This 'package' could be used in code using the name `@vote/api`.

Currently the API is still in heavy development and breaking changes may occur without any prior notice. For an example,
see `@vote/plugins/sample`.

## Events

Vote's event system has three event sources: `Form` object, Vue instance and `@vote/api`. Although they are not stable,
there does exists an documentation at [here][events-1]. These docs are generated from JSDoc comments. To view the latest
docs, perform a search using the keyword `@event`. Please document new events with this syntax.

## Elsewhere undocumented configurations

Questions' configurations stores in the `q.data.config` object. These are the configurations that is notable yet
undocumented elsewhere.

| Kind       | Name           | Data type | Default | Description                           | Side notes                                   |
|:-----------|:---------------|:----------|:--------|:--------------------------------------|:---------------------------------------------|
| validation | useValidation  | boolean   | false   | whether to use the validation         | available in `@vote/api` as `useValidation`  |
| validation | showValidation | boolean   | true    | whether to show validation rules      | available in `@vote/api` as `showValidation` |
| validation | invalidTip     | string    | null    | custom tip to show on invalid         | available in `@vote/api` as `invalidTip`     |
| display    | hidden         | boolean   | false   | whether the question should be hidden |                                              |

[vue-function-api]: https://github.com/vuejs/rfcs/blob/function-apis/active-rfcs/0000-function-api.md
[events-1]: https://vote-events-1.netlify.com/
