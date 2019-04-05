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
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import '../../@polymer/polymer/lib/elements/dom-if.js';
import '../../@polymer/polymer/lib/elements/dom-repeat.js';
import {afterNextRender} from '../../@polymer/polymer/lib/utils/render-status.js';
import '../../@polymer/paper-dropdown-menu/paper-dropdown-menu-light.js';
import '../../@polymer/paper-listbox/paper-listbox.js';
import '../../@polymer/paper-item/paper-item.js';
import '../../@polymer/paper-item/paper-item-body.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../@polymer/paper-input/paper-input.js';
import '../../@polymer/paper-spinner/paper-spinner.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@polymer/paper-toast/paper-toast.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
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
 * @polymer
 * @demo demo/index.html
 * @memberof UiElements
 */
class ThemesPanel extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --arc-font-body1;
    }

    header {
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    h2 {
      @apply --arc-font-headline;
      @apply --layout-flex;
    }

    h3 {
      @apply --arc-font-subhead;
    }

    .error-toast {
      background-color: var(--warning-primary-color, #FF7043);
      color: var(--warning-contrast-color, #fff);
    }

    .add-form {
      @apply --layout-horizontal;
      @apply --layout-center;
    }

    .add-form paper-input {
      @apply --layout-flex;
    }

    .selection-actions {
      @apply --layout-horizontal;
      @apply --layout-end;
    }

    .remove-theme {
      margin-left: 8px;
    }
    </style>
    <header>
      <h2>Themes</h2>
    </header>

    <section class="theme-selector">
      <div class="selection-actions">
        <paper-dropdown-menu-light label="Active theme" horizontal-align="left">
          <paper-listbox
            slot="dropdown-content"
            selected="{{activeTheme}}"
            attr-for-selected="data-id"
            on-selected-changed="_selectionChanged">
            <template is="dom-repeat" items="[[themes]]">
              <template is="dom-if" if="[[item.description]]">
                <paper-item data-id\$="[[item._id]]" label\$="[[item.title]]">
                  <paper-item-body two-line="">
                    <div>[[item.title]]</div>
                    <div secondary="">[[item.description]]</div>
                  </paper-item-body>
                </paper-item>
              </template>
              <template is="dom-if" if="[[!item.description]]">
                <paper-item data-id\$="[[item._id]]">[[item.title]]</paper-item>
              </template>
            </template>
          </paper-listbox>
        </paper-dropdown-menu-light>
        <template is="dom-if" if="[[!isDefaultTheme]]">
          <paper-icon-button
            icon="arc:delete"
            title="Remove theme from ARC"
            class="remove-theme"
            on-click="_uninstall"></paper-icon-button>
        </template>
      </div>
    </section>
    <template is="dom-if" if="[[addEnabled]]">
      <section class="add-theme">
        <h3>Install theme</h3>
        <p>Install new theme by providing its NPM name, GitHub repository as
          <code>owner/name#branch</code>, or absolute path to the theme on your local filesystem.</p>
        <div class="add-form">
          <paper-input label="Theme to install" value="{{_themeInstall}}"></paper-input>
          <paper-button on-click="_install">Install</paper-button>
          <paper-spinner active="[[_installPending]]"></paper-spinner>
        </div>
      </section>
    </template>
    <paper-toast id="noModel" text="Model not found. Please, report an issue." class="error-toast"></paper-toast>
    <paper-toast id="noSelection"
      text="Theme is not activated. Select theme and try again." class="error-toast"></paper-toast>
    <paper-toast id="noName" text="Add theme name to install it." class="error-toast"></paper-toast>
    <paper-toast id="defaultDelete" text="Preinstalled themes cannot be removed." class="error-toast"></paper-toast>
    <paper-toast id="errorToast" class="error-toast"></paper-toast>`;
  }

  static get properties() {
    return {
      /**
       * List of themes.
       */
      themes: Array,
      // ID of selected theme.
      activeTheme: String,
      // When set it won't check for themes list when added to the DOM.
      noAuto: Boolean,
      /**
       * When set it renders input field to install a theme.
       */
      addEnabled: Boolean,
      /**
       * Name of the theme to install
       */
      _themeInstall: String,
      /**
       * When true the app is installing the eheme.
       */
      _installPending: Boolean,
      /**
       * Computed value, true if selected theme is one of default themes.
       */
      isDefaultTheme: {
        type: Boolean,
        value: true,
        computed: '_computeIsDefault(themes.*, activeTheme)'
      },
      /**
       * Name of the default theme to use when installed theme is removed.
       */
      defaultThemeName: {
        type: String,
        value: 'advanced-rest-client/arc-electron-default-theme'
      }
    };
  }

  constructor() {
    super();
    this._activatedHandler = this._activatedHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('theme-activated', this._activatedHandler);
    if (!this.noAuto && !this.themes) {
      afterNextRender(this, this.refresh);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('theme-activated', this._activatedHandler);
  }

  _activatedHandler(e) {
    const {id} = e.detail;
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
   * Dispatches `themes-list` custom event to query model for the list of
   * available themes.
   * The event must be cancelled when handled (`e.preventDefault()`).
   * The list of themes should be returned as a Promise added to the `result`
   * property of the `detail` object of the event.
   *
   * @return {Promise}
   */
  refresh() {
    const e = this._dispatchListEvent();
    if (!e.defaultPrevented) {
      this.$.noModel.opened = true;
      return Promise.reject(new Error('Model not found'));
    }
    return e.detail.result
    .then((themes) => {
      this._processListResponse(themes);
      this.getActiveTheme()
      .catch((cause) => {
        console.warn(cause);
      });
    })
    .catch((cause) => this._handlePromiseError(cause));
  }

  _processListResponse(themes) {
    themes = themes || [];
    themes = themes.map((i) => {
      i = Object.assign({}, i);
      i.title = i.title || i.name;
      return i;
    });
    this.set('themes', themes);
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
  getActiveTheme() {
    const e = this._dispatchActiveInfoEvent();
    if (!e.defaultPrevented) {
      this.$.noModel.opened = true;
      return Promise.reject(new Error('Model not found'));
    }
    return e.detail.result
    .then((theme) => {
      if (!theme) {
        console.warn('Current theme info not available.');
        return;
      }
      this.__cancelChange = true;
      this.set('activeTheme', theme._id);
      this.__cancelChange = false;
    })
    .catch((cause) => this._handlePromiseError(cause));
  }

  _handlePromiseError(cause) {
    const message = cause.message || 'Theme data loading error.';
    this.$.errorToast.text = message;
    this.$.errorToast.opened = true;
    this._dispatch('send-analytics', {
      type: 'exception',
      description: cause.message || message,
      fatal: false
    });
    console.warn(cause);
  }

  _selectionChanged(e) {
    if (this.__cancelChange) {
      return;
    }
    const id = e.detail.value;
    const index = this.themes.findIndex((i) => i._id === id);
    if (index === -1) {
      this.$.noSelection.opened = true;
      return;
    }
    this._dispatchActivateEvent(id);
  }

  _install() {
    const name = this._themeInstall;
    if (!name) {
      this.$.noName.opened = true;
      return Promise.reject(new Error('Name not set'));
    }
    this._dispatchGaEvent('Installing theme');
    const e = this._dispatchInstallEvent(name);
    if (!e.defaultPrevented) {
      this.$.noModel.opened = true;
      return Promise.reject(new Error('Model not found'));
    }
    this._installPending = true;
    return e.detail.result
    .then((info) => {
      this._installPending = false;
      if (this.themes) {
        this.push('themes', info);
      } else {
        this.set('themes', [info]);
      }
      return this._dispatchActivateEvent(info._id);
    })
    .catch((cause) => {
      this._installPending = false;
      return this._handlePromiseError(cause);
    });
  }

  _computeIsDefault(record, activeTheme) {
    const themes = record && record.base;
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

  _uninstall() {
    if (this.isDefaultTheme) {
      this.$.defaultDelete.opened = true;
      return Promise.reject(new Error('Cannot delete default theme'));
    }
    this._dispatchGaEvent('Uninstalling theme');
    const e = this._dispatchUninstallEvent(this.activeTheme);
    if (!e.defaultPrevented) {
      this.$.noModel.opened = true;
      return Promise.reject(new Error('Model not found'));
    }
    this._installPending = true;
    return e.detail.result
    .then(() => {
      this._installPending = false;
      return this._dispatchActivateEvent(this.defaultThemeName);
    })
    .catch((cause) => {
      this._installPending = false;
      return this._handlePromiseError(cause);
    });
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
window.customElements.define('themes-panel', ThemesPanel);
