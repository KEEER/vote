Contributing
============

This repository is the KEEER Vote main repo. This is going to be published on GitHub,
so everything except issues and PRs are going to be in English.

## Notices

- Keep the project structure in dictionary order.
- Follow Git commit message guidelines.
- Make sure ESLint could be passed before committing.

## Psuedo-packages

This repo uses psuedo-packages to simplify code. These "packages" could be used:

- `@vote/core` - mapped to `./src/`
- `@vote/api` - mapped to `./src/api/`
- `@vote/plugins` - mapped to `./src/plugins`
- `@vote/themes` - mapped to `./src/themes`
- `@vote/locale` - mapped to `./locale`

Note that in `webpack`-generated files, `@vote/*` can only be used in plugins and themes,
while in files ran in `npm start`, `@vote/*` can be used anywhere.

TBD: publish these actual packages so that IntelliSense could work.

## Project structure

- `dist/` Distributions. Never remove `vote-config.js`
- `ejs/` Static HTML templates, used to generate pages in multiple languages
- `locale/` i18n files
- `src/` Main source directory
    - `api/` Plugin and theme API
    - `plugins/` Plugins
    - `sql/` SQLs for reference and update
    - `themes/` Themes
    - `db.js` Database helper
    - `form.js` Form utils
    - `index.js` Entry point
    - `load-plugins.js` [Not executed] A file to be included in `_bundle`
    - `log.js` Logging utils
    - `main.js` Koa application
    - `plugin.js` Plugin utils
    - `question.js` Question utils
    - `theme.js` Theme utils
    - `user.js` User system
- `static/` Static files (ToC, images, etc.)

## First run

```
# Run `src/sql/init.sql` first.
cp sample.env .env # Edit `.env` to make your database settings
npm i -D
npm run build
npm start
```

## Building

`npm run build`

## webpack-dev-server

`npm run wds`

## ESLint

`npm run lint`
