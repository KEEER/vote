Contributing
============

This repository is the KEEER Vote main repo. This is going to be published on GitHub,
so everything except issues and PRs are going to be in English.

## Notices

- Keep the project structure in English.
- Follow Git commit message guidlines.

## Project structure

- `dist/` Distributions. Never remove `vote-config.js`.
- `src/` Main source directory
    - `plugins/` Plugins
    - `themes/` Themes
    - `sql/` SQLs for reference
    - `db.js` Database helper
    - `form.js` Form utils
    - `index.js` Entry point
    - `loadPlugins.js` [Not executed] A file to be included in `_bundle`
    - `log.js` Logging utils
    - `main.js` Koa application
    - `plugin.js` Plugin utils
    - `question.js` Question utils
    - `sandbox.js` Plugin sandbox, to be removed
    - `submission.js` Submission utils, to be merged into `form.js`
    - `theme.js` Theme utils
- `static/` Static files (e.g. ToC)

## Building

`npm run build`

## webpack-dev-server

`npm run dev`

## ESLint

`npm run lint`
