Contributing
============

This directory contains the source code of Plugin Essentials. This plugin provides a variety of different functionalities, so please keep the structure clean.

## Notices

- Only keep necessary functionalities here. Split optional things to other plugins.
- Use unelevated buttons.

## Structure

- `common/` Common files
    - `query.js` GraphQL Query intepreter
    - `schema.graphql` GraphQL schema
    - `schemaText.js` loads the schema both in FE and BE
    - `validationTypes.js` defines validation types
    - `validator.js` does actual validation
- `editor/` Vote Form editor
- `form/` Scripts to be injected to form filling
    - `index.js` Entry point
    - `validate.js` Validator utility
    - `submit.js` Adds a listener to the hook `form:submit` so that the form could be submitted
- `server/` Script to be injected to backend
    - `index.js` Entry point
- `common/` Common files
- `plugin.json` Plugin meta file
