/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { LitElement, html } from 'lit-element';
import { deleteIcon } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-item/anypoint-item-body.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-toast/paper-toast.js';
import styles from './styles.js';

const defaultThemeName = 'advanced-rest-client/arc-electron-default-theme';
/**
 * A panel to display themes installed in the application.
 *
 * The element is an UI for themes logic in the application. It does not contain
 * logic to activate or discovery themes. It communicates with the application (model)
 * via custom events. See events description for more information. Note that most events
 * have to be cancelled.
 *
 * Once the element is "opened" it queries for list of available themes, if it wasn't
 * already. When the list of themes changes call `refreshThemes()` on the element
 * to update list of themes in the UI.
 *
 * ## Theme model
 *
 * The object consist with the following properties:
 *
 * - **name** `String` Theme id
 * - **title** `String` Theme title
 * - **description** `String` Theme short description.
 * - **isDefault** `Boolean` True if the theme cannot be uninstalled
 * - **location** `String` Theme location
 * - **mainFile** `String` Location to the main file
 * - **version** `{String}` Theme version number
 * - **_id** `{String}` Theme datasdtore id (used to find the theme on the list
 * and to be consisten with other elements. ARC doesn't actually use this property
 * and it is the same as `name`).
 *
 * ### Styling
 *
 * `<themes-panel>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--warning-primary-color` | Main color of the warning messages | `#FF7043`
 * `--warning-contrast-color` | Contrast color for the warning color | `#fff`
 *
 * @customElement
 * @demo demo/index.html
 * @memberof UiElements
 */
export class ThemesPanel extends LitElement {
  static get styles() {
    return styles;
  }

  static get properties() {
    return {
      /**
       * Enables compatibility with Anypoint platform
       */
      compatibility: { type: Boolean },
      /**
       * Enables material desin outlined theme
       */
      outlined: { type: Boolean },
      /**
       * List of themes.
       */
      themes: { type: Array },
      // ID of selected theme.
      activeTheme: { type: String },
      // When set it won't check for themes list when added to the DOM.
      noAuto: { type: Boolean },
      /**
       * When set it renders input field to install a theme.
       */
      addEnabled: { type: Boolean },
      /**
       * When true the app is installing the eheme.
       */
      _installPending: { type: Boolean }
    };
  }
  /**
   * @return {Boolean} `true` if selected theme is one of default themes.
   */
  get isDefaultTheme() {
    const { themes, activeTheme } = this;
    if (!themes || !activeTheme || !themes.length) {
      return false;
    }
    const item = themes.find((item) => item._id === activeTheme);
    if (!item) {
      return false;
    }
    if (typeof item.isDefault === 'undefined') {
      return false;
    }
    return item.isDefault;
  }

  constructor() {
    super();
    this._activatedHandler = this._activatedHandler.bind(this);
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    window.addEventListener('theme-activated', this._activatedHandler);
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    window.removeEventListener('theme-activated', this._activatedHandler);
  }

  firstUpdated() {
    if (!this.noAuto && !this.themes) {
      this.refresh();
    }
  }

  _activatedHandler(e) {
    const { id } = e.detail;
    if (!id) {
      return;
    }
    if (id !== this.activeTheme) {
      this.activeTheme = id;
    }
  }

  /**
   * Dispatches a CustomEvent of a `type` with `detail` object.
   * @param {String} type Event type
   * @param {Object} detail Object to attach to the event
   * @return {CustomEvent}
   */
  _dispatch(type, detail) {
    const e = new CustomEvent(type, {
      composed: true,
      bubbles: true,
      cancelable: true,
      detail
    });
    this.dispatchEvent(e);
    return e;
  }
  /**
   * Dispatches `themes-list` event
   * @return {CustomEvent}
   */
  _dispatchListEvent() {
    return this._dispatch('themes-list', {});
  }
  /**
   * Dispatches `theme-active-info` event
   * @return {CustomEvent}
   */
  _dispatchActiveInfoEvent() {
    return this._dispatch('theme-active-info', {});
  }
  /**
   * Dispatches `theme-activate` event
   * @param {String} theme Theme ID to activate
   * @return {CustomEvent}
   */
  _dispatchActivateEvent(theme) {
    return this._dispatch('theme-activate', {
      theme
    });
  }
  /**
   * Dispatches `theme-install` event
   * @param {String} name Theme name
   * @return {CustomEvent}
   */
  _dispatchInstallEvent(name) {
    return this._dispatch('theme-install', {
      name
    });
  }
  /**
   * Dispatches `theme-uninstall` event
   * @param {String} name Theme name
   * @return {CustomEvent}
   */
  _dispatchUninstallEvent(name) {
    return this._dispatch('theme-uninstall', {
      name
    });
  }
  /**
   * Dispatches GA event.
   * The event's category is `Web sockets`.
   * @param {String} action Event action.
   * @return {CustomEvent}
   */
  _dispatchGaEvent(action) {
    return this._dispatch('send-analytics', {
      type: 'event',
      category: 'Themes panel',
      action
    });
  }
  /**
   * Handles an exception by sending exception details to GA.
   * @param {String} message A message to send.
   */
  _handleException(message) {
    const e = new CustomEvent('send-analytics', {
     bubbles: true,
     composed: true,
     detail: {
       type: 'exception',
       description: message
     }
    });
    this.dispatchEvent(e);
    const toast = this.shadowRoot.querySelector('#errorToast');
    toast.text = message;
    toast.opened = true;
  }
  /**
   * Dispatches `themes-list` custom event to query model for the list of
   * available themes.
   * The event must be cancelled when handled (`e.preventDefault()`).
   * The list of themes should be returned as a Promise added to the `result`
   * property of the `detail` object of the event.
   *
   * @return {Promise}
   */
  async refresh() {
    const e = this._dispatchListEvent();
    if (!e.defaultPrevented) {
      this._handleException('Themes model not found');
      return;
    }
    try {
      const themes = await e.detail.result;
      this._processListResponse(themes);
      await this.getActiveTheme();
    } catch (e) {
      this.themes = undefined;
      this._handleException(e.message);
    }
  }

  _processListResponse(themes) {
    themes = themes || [];
    themes = themes.map((i) => {
      i = Object.assign({}, i);
      i.title = i.title || i.name;
      return i;
    });
    this.themes = themes;
  }
  /**
   * Dispatches `theme-active-info` custom event to query model for currently
   * activated theme. The model should always return theme info object, even
   * if it's a default object.
   *
   * The theme info object should be returned as a Promise added to the `result`
   * property of the `detail` object of the event.
   *
   * @return {Promise}
   */
  async getActiveTheme() {
    const e = this._dispatchActiveInfoEvent();
    if (!e.defaultPrevented) {
      this._handleException('Themes model not found');
      return;
    }
    try {
      const theme = await e.detail.result;
      if (!theme) {
        this._handleException('Current theme not available');
        return;
      }
      this.__cancelChange = true;
      this.activeTheme = theme._id;
      this.__cancelChange = false;
    } catch (e) {
      this.activeTheme = undefined;
      this._handleException(e.message);
    }
  }

  _selectionChanged(e) {
    if (this.__cancelChange) {
      return;
    }
    const id = e.detail.value;
    if (this.activeTheme === id) {
      return;
    }
    const index = this.themes.findIndex((i) => i._id === id);
    if (index === -1) {
      return;
    }
    this.activeTheme = id;
    return this._dispatchActivateEvent(id);
  }

  async _install() {
    const name = this._themeInstall;
    if (!name) {
      this._handleException('Theme name is not set');
      return;
    }
    this._dispatchGaEvent('Installing theme');
    const e = this._dispatchInstallEvent(name);
    if (!e.defaultPrevented) {
      this._handleException('Themes model not found');
      return;
    }
    this._installPending = true;
    try {
      const info = await e.detail.result;
      const items = this.themes || [];
      items.push(info);
      this.themes = [...items];
      this._dispatchActivateEvent(info._id);
    } catch (e) {
      this._handleException(e.message);
    }
    this._installPending = false;
  }

  async _uninstall() {
    if (this.isDefaultTheme) {
      this._handleException('Cannot delete default theme');
      return;
    }
    this._dispatchGaEvent('Uninstalling theme');
    const e = this._dispatchUninstallEvent(this.activeTheme);
    if (!e.defaultPrevented) {
      this._handleException('Themes model not found');
      return;
    }
    this._installPending = true;
    try {
      await e.detail.result;
      this._dispatchActivateEvent(defaultThemeName);
    } catch (e) {
      this._handleException(e.message);
    }
    this._installPending = false;
  }

  _nameHandler(e) {
    this._themeInstall = e.detail.value;
  }

  _headerTemplate() {
    return html`<header>
      <h2>Themes</h2>
    </header>`;
  }

  _selectionDropdownTemplate() {
    const {
      compatibility,
      outlined,
      activeTheme
    } = this;
    const themes = this.themes || [];

    return html`<anypoint-dropdown-menu
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      horizontalalign="left">
      <label slot="label">Active theme</label>
      <anypoint-listbox
        slot="dropdown-content"
        ?compatibility="${compatibility}"
        attrforselected="data-id"
        .selected="${activeTheme}"
        @selected-changed="${this._selectionChanged}">
        ${themes.map((item) => this._selectionItemTemplate(item, compatibility))}
      </anypoint-listbox>
    </anypoint-dropdown-menu>`;
  }

  _selectionItemTemplate(item, compatibility) {
    if (item.description) {
      return html`<anypoint-item
        data-id="${item._id}"
        label="${item.title}"
        ?compatibility="${compatibility}">
        <anypoint-item-body twoline>
          <div>${item.title}</div>
          <div secondary>${item.description}</div>
        </anypoint-item-body>
      </anypoint-item>`;
    } else {
      return html`<anypoint-item
        data-id="${item._id}"
        ?compatibility="${compatibility}">${item.title}</anypoint-item>`;
    }
  }

  _removeThemeTemplate() {
    if (this.isDefaultTheme) {
      return '';
    }
    const {
      compatibility
    } = this;
    return html`<anypoint-icon-button
      class="action-icon"
      data-action="delete"
      title="Remove theme from ARC"
      aria-label="Activate to remove the theme"
      ?compatibility="${compatibility}"
      @click="${this._uninstall}"
    >
      <span class="icon">${deleteIcon}</span>
    </anypoint-icon-button>`;
  }

  _selectorTemplate() {
    return html`<section class="theme-selector">
      <div class="selection-actions">
        ${this._selectionDropdownTemplate()}
        ${this._removeThemeTemplate()}
      </div>
    </section>`;
  }

  _addTemplate() {
    if (!this.addEnabled) {
      return '';
    }
    const {
      compatibility,
      outlined,
      _installPending
    } = this;
    return html`<section class="add-theme">
      <h3>Install theme</h3>
      <p>
        Install new theme by providing its NPM name, GitHub repository as
        <code>owner/name#branch</code>,
        or absolute path to the theme on your local filesystem.
      </p>
      <div class="add-form">
        <anypoint-input
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
          ?disabled="${_installPending}"
          @value-changed="${this._nameHandler}"
        >
          <label slot="label">Theme to install</label>
        </anypoint-input>
        <anypoint-button
          ?compatibility="${compatibility}"
          ?disabled="${_installPending}"
          @click="${this._install}"
        >Install</anypoint-button>
        <paper-spinner .active="${_installPending}"></paper-spinner>
      </div>
    </section>
    `;
  }

  _toastsTemplate() {
    return html`<paper-toast id="errorToast" class="error-toast"></paper-toast>`;
  }

  render() {
    return html`
    ${this._headerTemplate()}
    ${this._selectorTemplate()}
    ${this._addTemplate()}
    ${this._toastsTemplate()}
    `;
  }
  /**
   * Dispatched when the element requests to list currently installed themes.
   * The event is cancelable and the model must cancel the event when handling
   * it. Otherwise the element will ignore the result and display error.
   *
   * The result should be a Promise resolved to a list of `Theme` objects.
   * See element description for data model. The promise must be set on `result`
   * property of the `detail` object.
   *
   * ## Example
   * ```javascript
   * e.preventDefault();
   * e.detail.result = Promise.resolve({...});
   * ```
   *
   * @event themes-list
   */

  /**
   * Dispatched when the element requests information about currently
   * activated theme.
   *
   * The element does not assume default theme. This event should always result
   * with a theme info object.
   *
   * The event is cancelable and the model must cancel the event when handling
   * it. Otherwise the element will ignore the result and display error.
   *
   * The result should be a Promise resolved to a `Theme` objects.
   * See element description for data model. The promise must be set on `result`
   * property of the `detail` object.
   *
   * ## Example
   * ```javascript
   * e.preventDefault();
   * e.detail.result = Promise.resolve({...});
   * ```
   *
   * @event theme-active-info
   */

  /**
   * Dispatched when the user selected a theme to be activated.
   *
   * @event theme-activate
   * @param {Object} theme The theme infor object. See element description for
   * morel information.
   */

  /**
   * Dispatched when the user requests to install new theme.
   * @event theme-install
   * @param {String} name A name of the theme to install
   */
}
