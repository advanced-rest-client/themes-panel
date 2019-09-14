[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/themes-panel.svg)](https://www.npmjs.com/package/@advanced-rest-client/themes-panel)

[![Build Status](https://travis-ci.org/advanced-rest-client/themes-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/themes-panel)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/themes-panel)

# themes-panel

A panel to render themes installed in Advanced REST Client.

This panel does not have own model in ARC datastore as themes are handled differently in Electron and Chrome App.
Each version of the application handles events but it's own.

## Usage

### Installation
```
npm install --save @advanced-rest-client/themes-panel
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/themes-panel/themes-panel.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <themes-panel></themes-panel>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/themes-panel
cd themes-panel
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```

## API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)
