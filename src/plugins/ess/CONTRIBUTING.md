Contributing
============

This directory contains the source code of Plugin Essentials. This plugin provides a variety of different functionalities, so please keep the structure clean.

## Notices

- Only keep necessary functionalities here. Split optional things to other plugins.
- Use unelevated buttons.

## Structure

- `editor/` Vote Form editor
- `form/` Scripts to be injected to frontend
    - `index.js` Entry point
    - `submit.js` Adds a listener to the hook `form:submit` so that the form could be submitted
    - `styles.css` Styles used by the plugin
- `server/` Script to be injected to backend
    - `index.js` Entry point
    - `query.js` Query intepreter
- `common/` Common files
- `plugin.json` Plugin meta file
