# \<date-picker>

A date picker web component, based on [duet date picker](https://github.com/duetds/date-picker), except authored with Lit and using shadow DOM.

This is a work in progress.

Todo:

- [x] Convert to Lit and use Shadow DOM
- [x] Add support for formdata event
- [ ] Port test suite to web-test-runner/mocha
- [x] Extract calendar component
- [x] RTL support
- [ ] Perhaps support slotting your own input?
- [ ] Decide on project/tag name
- [ ] add `valueAsDate` property
- [ ] add `valueAsNumber` property
- [ ] add `validity` property

## Installation

```bash
npm i @wickynilliams/date-picker
```

## Usage

```html
<script type="module" src="date-picker/date-picker.js"></script>

<date-picker></date-picker>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
