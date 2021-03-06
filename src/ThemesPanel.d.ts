/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   src/ThemesPanel.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {LitElement, html} from 'lit-element';

export {ThemesPanel};

declare namespace UiElements {

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
   */
  class ThemesPanel extends LitElement {
    readonly isDefaultTheme: Boolean|null;

    /**
     * Enables compatibility with Anypoint platform
     */
    compatibility: boolean|null|undefined;

    /**
     * Enables material desin outlined theme
     */
    outlined: boolean|null|undefined;

    /**
     * List of themes.
     */
    themes: any[]|null|undefined;

    /**
     * ID of selected theme.
     */
    activeTheme: string|null|undefined;

    /**
     * When set it won't check for themes list when added to the DOM.
     */
    noAuto: boolean|null|undefined;

    /**
     * When set it renders input field to install a theme.
     */
    addEnabled: boolean|null|undefined;

    /**
     * When true the app is installing the eheme.
     */
    _installPending: boolean|null|undefined;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    render(): any;
    _activatedHandler(e: any): void;

    /**
     * Dispatches a CustomEvent of a `type` with `detail` object.
     *
     * @param type Event type
     * @param detail Object to attach to the event
     */
    _dispatch(type: String|null, detail: object|null): CustomEvent|null;

    /**
     * Dispatches `themes-list` event
     */
    _dispatchListEvent(): CustomEvent|null;

    /**
     * Dispatches `theme-active-info` event
     */
    _dispatchActiveInfoEvent(): CustomEvent|null;

    /**
     * Dispatches `theme-activate` event
     *
     * @param theme Theme ID to activate
     */
    _dispatchActivateEvent(theme: String|null): CustomEvent|null;

    /**
     * Dispatches `theme-install` event
     *
     * @param name Theme name
     */
    _dispatchInstallEvent(name: String|null): CustomEvent|null;

    /**
     * Dispatches `theme-uninstall` event
     *
     * @param name Theme name
     */
    _dispatchUninstallEvent(name: String|null): CustomEvent|null;

    /**
     * Dispatches GA event.
     * The event's category is `Web sockets`.
     *
     * @param action Event action.
     */
    _dispatchGaEvent(action: String|null): CustomEvent|null;

    /**
     * Handles an exception by sending exception details to GA.
     *
     * @param message A message to send.
     */
    _handleException(message: String|null): void;

    /**
     * Dispatches `themes-list` custom event to query model for the list of
     * available themes.
     * The event must be cancelled when handled (`e.preventDefault()`).
     * The list of themes should be returned as a Promise added to the `result`
     * property of the `detail` object of the event.
     */
    refresh(): Promise<any>|null;
    _processListResponse(themes: any): void;

    /**
     * Dispatches `theme-active-info` custom event to query model for currently
     * activated theme. The model should always return theme info object, even
     * if it's a default object.
     *
     * The theme info object should be returned as a Promise added to the `result`
     * property of the `detail` object of the event.
     */
    getActiveTheme(): Promise<any>|null;
    _selectionChanged(e: any): any;
    _install(): any;
    _uninstall(): any;
    _nameHandler(e: any): void;
    _headerTemplate(): any;
    _selectionDropdownTemplate(): any;
    _selectionItemTemplate(item: any, compatibility: any): any;
    _removeThemeTemplate(): any;
    _selectorTemplate(): any;
    _addTemplate(): any;
    _toastsTemplate(): any;
  }
}
