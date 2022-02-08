# \<date-picker>

A date picker web component, based on [duet date picker](https://github.com/duetds/date-picker), except authored with Lit and using shadow DOM.

This is a work in progress.

Todo:

- [x] Convert to Lit and use Shadow DOM
- [x] Add support for formdata event
- [x] Port test suite to web-test-runner and mocha
- [x] Extract calendar component
- [x] RTL support
- [ ] Perhaps support slotting your own input?
- [ ] Decide on project/tag name
- [x] add `valueAsDate` property
- [x] add `valueAsNumber` property
- [x] add `validity` property
- [x] simplify user parsing/formatting. named capture groups for parse? format string?
- [x] configurable disallowed chars
- [ ] date range component?
- [ ] readonly
- [ ] track bundle size
- [ ] configurable short day names? looks like there's a lot of variation and substring(2) might be bad e.g: https://www.ema.europa.eu/en/documents/other/abbreviation-names-days-calendarised-blisters_en.pdf
- [ ] docs!
- [ ] css parts

## Installation

Still under development, not yet available on npm!

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
