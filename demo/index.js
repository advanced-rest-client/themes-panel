import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@polymer/paper-toast/paper-toast.js';
import 'chance/chance.js';
import '../themes-panel.js';
/* global chance */

const arcPrefix = '@advanced-rest-client/arc-electron-';
const defaultThemes = [{
  '_id': 'advanced-rest-client/arc-electron-default-theme',
  'title': 'Default theme',
  'name': arcPrefix + 'default-theme',
  'version': '2.0.0-preview',
  'location': arcPrefix + 'default-theme',
  'mainFile': arcPrefix + 'default-theme/arc-electron-default-theme.html',
  'description': 'Advanced REST Client default theme',
  'isDefault': true
},
{
  '_id': 'advanced-rest-client/arc-electron-anypoint-theme',
  'title': 'Anypoint theme',
  'name': arcPrefix + 'anypoint-theme',
  'version': '2.0.0-preview',
  'location': arcPrefix + 'anypoint-theme',
  'mainFile': arcPrefix + 'anypoint-theme/arc-electron-anypoint-theme.html',
  'description': 'Advanced REST Client anypoint theme',
  'isDefault': true
},
{
  '_id': 'advanced-rest-client/arc-electron-dark-theme',
  'title': 'Dark theme',
  'name': arcPrefix + 'dark-theme',
  'version': '2.0.0-preview',
  'location': arcPrefix + 'dark-theme',
  'mainFile': arcPrefix + 'dark-theme/arc-electron-dark-theme.html',
  'description': 'Advanced REST Client dark theme',
  'isDefault': true
}];

function genThemeInfo() {
  const name = chance.word();
  return {
    _id: name,
    name: name + '-theme',
    title: name,
    description: chance.sentence(),
    mainFile: 'arc-theme.html',
    location: name + '/arc-theme.html'
  };
}

class DemoPage extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility',
      'outlined'
    ]);
    this._componentName = 'themes-panel';
    this.demoStates = ['Filles', 'Outlined', 'Anypoint'];

    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.outlined = state === 1;
    this.compatibility = state === 2;
  }

  generateThemes(e) {
    e.preventDefault();
    const themes = Array.from(defaultThemes);
    for (let i = 0; i < 5; i++) {
      themes.push(genThemeInfo());
    }
    e.detail.result = Promise.resolve(themes);
  }

  activeThemeInfo(e) {
    e.preventDefault();
    e.detail.result = Promise.resolve(Object.assign({}, defaultThemes[0]));
  }

  activateHandler(e) {
    e.preventDefault();
    document.getElementById('activate').opened = true;
  }

  installHandler(e) {
    e.preventDefault();
    document.getElementById('install').opened = true;
    e.detail.result = new Promise((resolve) => {
      setTimeout(() => {
        resolve(genThemeInfo());
      }, 1000);
    });
  }

  uninstallHandler(e) {
    e.preventDefault();
    document.getElementById('uninstall').opened = true;
    e.detail.result = new Promise((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the cookies manager element with various
          configuration options.
        </p>

        <arc-interactive-demo
          .states="${demoStates}"
          @state-chanegd="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <themes-panel
            ?compatibility="${compatibility}"
            ?outlined="${outlined}"
            addenabled
            slot="content"
            @themes-list="${this.generateThemes}"
            @theme-active-info="${this.activeThemeInfo}"
            @theme-activate="${this.activateHandler}"
            @theme-install="${this.installHandler}"
            @theme-uninstall="${this.uninstallHandler}"
          ></themes-panel>
        </arc-interactive-demo>
      </section>
      <paper-toast id="activate" text="Activate theme event handled."></paper-toast>
      <paper-toast id="install" text="Install theme event handled."></paper-toast>
      <paper-toast id="uninstall" text="Uninstall theme event handled."></paper-toast>
    `;
  }

  contentTemplate() {
    return html`
      <h2>ARC themes screen</h2>
      ${this._demoTemplate()}
    `;
  }
}

const instance = new DemoPage();
instance.render();
window._demo = instance;
