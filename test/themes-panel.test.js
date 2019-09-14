import { fixture, assert, html } from '@open-wc/testing';
// import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { DataModel } from './data-model.js';
import '../themes-panel.js';

describe('<themes-panel>', function() {
  async function basicFixture() {
    return await fixture(html`<themes-panel></themes-panel>`);
  }

  describe('_dispatch()', () => {
    const type = 'ev-type';
    const eventDetail = 'ev-detail';
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches an event', () => {
      const spy = sinon.spy();
      element.addEventListener(type, spy);
      element._dispatch(type, eventDetail);
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const result = element._dispatch(type, eventDetail);
      assert.typeOf(result, 'customevent');
      assert.equal(result.type, type);
    });

    it('Event is cancelable', () => {
      const e = element._dispatch(type, eventDetail);
      assert.isTrue(e.cancelable);
    });

    it('Event bubbles', () => {
      const e = element._dispatch(type, eventDetail);
      assert.isTrue(e.bubbles);
    });

    it('Event is composed', () => {
      const e = element._dispatch(type, eventDetail);
      if (e.composed !== undefined) { // Edge
        assert.isTrue(e.composed);
      }
    });

    it('Event has detail', () => {
      const e = element._dispatch(type, eventDetail);
      assert.equal(e.detail, eventDetail);
    });
  });

  describe('_dispatchListEvent()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _dispatch() with type', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchListEvent();
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'themes-list');
    });

    it('Detail is set', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchListEvent();
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][1], {});
    });
  });

  describe('_dispatchActiveInfoEvent()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _dispatch() with type', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchActiveInfoEvent();
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'theme-active-info');
    });

    it('Detail is set', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchActiveInfoEvent();
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][1], {});
    });
  });

  describe('_dispatchActivateEvent()', () => {
    const theme = 'test-name';
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _dispatch() with type', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchActivateEvent(theme);
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'theme-activate');
    });

    it('Detail is set', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchActivateEvent(theme);
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][1], {
        theme
      });
    });
  });

  describe('_dispatchInstallEvent()', () => {
    const name = 'test-name';
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _dispatch() with type', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchInstallEvent(name);
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'theme-install');
    });

    it('Detail is set', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchInstallEvent(name);
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][1], {
        name
      });
    });
  });

  describe('_dispatchUninstallEvent()', () => {
    const name = 'test-name';
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _dispatch() with type', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchUninstallEvent(name);
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'theme-uninstall');
    });

    it('Detail is set', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchUninstallEvent(name);
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][1], {
        name
      });
    });
  });

  describe('_dispatchGaEvent()', () => {
    const action = 'test-action';
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _dispatch() with type', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchGaEvent(action);
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], 'send-analytics');
    });

    it('Detail is set', () => {
      const spy = sinon.spy(element, '_dispatch');
      element._dispatchGaEvent(action);
      assert.isTrue(spy.called);
      assert.deepEqual(spy.args[0][1], {
        type: 'event',
        category: 'Themes panel',
        action
      });
    });
  });

  describe('_processListResponse()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets empty array when no response', () => {
      element._processListResponse();
      assert.typeOf(element.themes, 'array');
      assert.deepEqual(element.themes, []);
    });

    it('Sets response data', () => {
      element._processListResponse(DataModel.generateThemes());
      assert.typeOf(element.themes, 'array');
      assert.lengthOf(element.themes, 5);
    });

    it('Array items are a copy', () => {
      const items = DataModel.generateThemes();
      element._processListResponse(items);
      items[0].name = 'test';
      assert.notEqual(element.themes[0].name, 'test');
    });

    it('Sets title from name if not exists', () => {
      const items = DataModel.generateThemes();
      items[0].title = undefined;
      element._processListResponse(items);
      assert.notEqual(element.themes[0].title, undefined);
    });
  });

  describe('refresh()', () => {
    let element;
    beforeEach(async () => {
      DataModel.listen();
      element = await basicFixture();
    });

    afterEach(async () => {
      DataModel.unlisten();
    });

    it('Calls _dispatchListEvent()', () => {
      const spy = sinon.spy(element, '_dispatchListEvent');
      element.refresh();
      assert.isTrue(spy.called);
    });

    it('Returns a promise', () => {
      const result = element.refresh();
      assert.typeOf(result.then, 'function');
      return result;
    });
-
    it('Calls _processListResponse() with result', () => {
      const spy = sinon.spy(element, '_processListResponse');
      return element.refresh()
      .then(() => {
        assert.isTrue(spy.called);
        assert.typeOf(spy.args[0][0], 'array');
      });
    });

    it('Calls getActiveTheme()', () => {
      const spy = sinon.spy(element, 'getActiveTheme');
      return element.refresh()
      .then(() => {
        assert.isTrue(spy.called);
      });
    });

    it('renders error toast when no model', async () => {
      DataModel.unlisten();
      await element.refresh();
      assert.isTrue(element.shadowRoot.querySelector('#errorToast').opened);
    });

    it('Calls _handleException() when model error', () => {
      DataModel.unlisten();
      window.addEventListener('themes-list', function f(e) {
        window.removeEventListener('themes-list', f);
        e.preventDefault();
        e.detail.result = Promise.reject(new Error('test'));
      });
      const spy = sinon.spy(element, '_handleException');
      return element.refresh()
      .then(() => {
        assert.isTrue(spy.called);
      });
    });
  });

  describe('_handleException()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Opens the toast with message', () => {
      element._handleException('test');

      assert.isTrue(element.shadowRoot.querySelector('#errorToast').opened);
      assert.equal(element.shadowRoot.querySelector('#errorToast').text, 'test');
    });
  });

  describe('#isDefaultTheme', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns true if selected is default theme', () => {
      element.themes = DataModel.generateThemes();
      element.activeTheme = 'advanced-rest-client/arc-electron-default-theme';
      assert.isTrue(element.isDefaultTheme);
    });

    it('Returns false for other themes', () => {
      element.themes = DataModel.generateThemes();
      element.activeTheme = element.themes[1]._id;
      assert.isFalse(element.isDefaultTheme);
    });

    it('Returns false if theme has not isDefault', () => {
      element.themes = DataModel.generateThemes();
      element.themes[1].isDefault = undefined;
      element.activeTheme = element.themes[1]._id;

      assert.isFalse(element.isDefaultTheme);
    });

    it('Returns false if theme do not exists', () => {
      element.themes = DataModel.generateThemes();
      element.activeTheme = 'unknown-theme';
      assert.isFalse(element.isDefaultTheme);
    });

    it('Returns false if no activeTheme', () => {
      element.themes = DataModel.generateThemes();
      assert.isFalse(element.isDefaultTheme);
    });
  });

  describe('getActiveTheme()', () => {
    let element;
    beforeEach(async () => {
      DataModel.listen();
      element = await basicFixture();
    });

    afterEach(async () => {
      DataModel.unlisten();
    });

    it('Calls _dispatchActiveInfoEvent()', () => {
      const spy = sinon.spy(element, '_dispatchActiveInfoEvent');
      element.getActiveTheme();
      assert.isTrue(spy.called);
    });

    it('Sets active theme info', () => {
      return element.getActiveTheme()
      .then(() => {
        assert.equal(element.activeTheme, DataModel.defaultTheme._id);
      });
    });

    it('Won\'t call _dispatchActivateEvent()', () => {
      const spy = sinon.spy(element, '_dispatchActivateEvent');
      return element.getActiveTheme()
      .then(() => {
        assert.isFalse(spy.called);
      });
    });

    it('opens error when event is not handled', async () => {
      DataModel.unlisten();
      await element.getActiveTheme()
      assert.isTrue(element.shadowRoot.querySelector('#errorToast').opened);
    });

    it('Calls _handleException() when model error', () => {
      DataModel.unlisten();
      window.addEventListener('theme-active-info', function f(e) {
        window.removeEventListener('theme-active-info', f);
        e.preventDefault();
        e.detail.result = Promise.reject(new Error('test'));
      });
      const spy = sinon.spy(element, '_handleException');
      return element.getActiveTheme()
      .then(() => {
        assert.isTrue(spy.called);
      });
    });
  });

  describe('_activatedHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.themes = DataModel.generateThemes();
    });

    it('Sets activeTheme from theme-activated event', () => {
      document.body.dispatchEvent(new CustomEvent('theme-activated', {
        bubbles: true,
        detail: {
          id: element.themes[1]._id
        }
      }));
      assert.equal(element.activeTheme, element.themes[1]._id);
    });

    it('Ignores event when id is not set', () => {
      document.body.dispatchEvent(new CustomEvent('theme-activated', {
        bubbles: true,
        detail: {}
      }));
      assert.isUndefined(element.activeTheme);
    });

    it('Skips setter when already active', () => {
      // for coverage
      element.activeTheme = element.themes[1]._id;
      document.body.dispatchEvent(new CustomEvent('theme-activated', {
        bubbles: true,
        detail: {
          id: element.themes[1]._id
        }
      }));
      assert.equal(element.activeTheme, element.themes[1]._id);
    });
  });

  describe('_selectionChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.themes = DataModel.generateThemes();
    });

    it('Does nothing when __cancelChange is set', () => {
      element.__cancelChange = true;
      const spy = sinon.spy(element, '_dispatchActivateEvent');
      element._selectionChanged({
        detail: {
          value: element.themes[1]._id
        }
      });
      assert.isFalse(spy.called);
    });

    it('Opens noSelection toast when theme not found', () => {
      element._selectionChanged({
        detail: {
          value: 'unknown'
        }
      });
      assert.isTrue(element.shadowRoot.querySelector('#errorToast').opened);
    });

    it('Calls _dispatchActivateEvent() with an argument', () => {
      const spy = sinon.spy(element, '_dispatchActivateEvent');
      element._selectionChanged({
        detail: {
          value: element.themes[1]._id
        }
      });
      assert.isTrue(spy.called);
      assert.equal(spy.args[0][0], element.themes[1]._id);
    });
  });

  describe('_install()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element._themeInstall = 'test-theme';

    });

    function handler(e) {
      e.preventDefault();
      e.detail.result = Promise.resolve({
        _id: 'test-id',
        name: 'test-name'
      });
    }

    function errorHandler(e) {
      e.preventDefault();
      e.detail.result = Promise.reject(new Error('test'));
    }

    afterEach(async () => {
      window.removeEventListener('theme-install', handler);
      window.removeEventListener('theme-install', errorHandler);
    });

    it('opens error when no name', async () => {
      element._themeInstall = '';
      await element._install();
      assert.isTrue(element.shadowRoot.querySelector('#errorToast').opened);
    });

    it('Opens noName toast when no name', () => {
      element._themeInstall = '';
      element._install().catch(() => {});
      assert.isTrue(element.shadowRoot.querySelector('#errorToast').opened);
    });

    it('Dispatches theme-install event', () => {
      window.addEventListener('theme-install', handler);
      const spy = sinon.spy();
      element.addEventListener('theme-install', spy);
      return element._install()
      .then(() => {
        assert.isTrue(spy.called, 'Event called');
        assert.equal(spy.args[0][0].detail.name, element._themeInstall);
      });
    });

    it('opens error when theme-install event is not handled', async () => {
      await element._install();
      assert.isTrue(element.shadowRoot.querySelector('#errorToast').opened);
    });

    it('Opens noModel toast when event is not handled', () => {
      element._install().catch(() => {});
      assert.isTrue(element.shadowRoot.querySelector('#errorToast').opened);
    });

    it('Sets _installPending property', () => {
      window.addEventListener('theme-install', handler);
      element._install().catch(() => {});
      assert.isTrue(element._installPending);
    });

    it('Resets _installPending property', () => {
      window.addEventListener('theme-install', handler);
      return element._install()
      .then(() => {
        assert.isFalse(element._installPending);
      });
    });

    it('Creates themes array', () => {
      window.addEventListener('theme-install', handler);
      return element._install()
      .then(() => {
        assert.lengthOf(element.themes, 1);
      });
    });

    it('Adds new theme to the list', () => {
      element.themes = DataModel.generateThemes();
      window.addEventListener('theme-install', handler);
      return element._install()
      .then(() => {
        assert.lengthOf(element.themes, 6);
      });
    });

    it('Resets _installPending property when process error', () => {
      window.addEventListener('theme-install', errorHandler);
      return element._install()
      .then(() => {
        assert.isFalse(element._installPending);
      });
    });

    it('Calles _handleException() when process error', () => {
      window.addEventListener('theme-install', errorHandler);
      const spy = sinon.spy(element, '_handleException');
      return element._install()
      .then(() => {
        assert.isTrue(spy.called);
      });
    });
  });

  describe('_uninstall()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.themes = DataModel.generateThemes();
      // Not default theme
      element.activeTheme = element.themes[1]._id;

    });

    function handler(e) {
      e.preventDefault();
      e.detail.result = Promise.resolve();
    }

    function errorHandler(e) {
      e.preventDefault();
      e.detail.result = Promise.reject(new Error('test'));
    }

    afterEach(async () => {
      window.removeEventListener('theme-uninstall', handler);
      window.removeEventListener('theme-uninstall', errorHandler);
    });

    it('opens error when isDefaultTheme', async () => {
      element.activeTheme = element.themes[0]._id;
      assert.isTrue(element.isDefaultTheme);
      await element._uninstall();
      assert.isTrue(element.shadowRoot.querySelector('#errorToast').opened);
    });

    it('Opens defaultDelete toast when no name', () => {
      element.activeTheme = element.themes[0]._id;
      element._uninstall().catch(() => {});
      assert.isTrue(element.shadowRoot.querySelector('#errorToast').opened);
    });

    it('Dispatches theme-uninstall event', () => {
      window.addEventListener('theme-uninstall', handler);
      const spy = sinon.spy();
      element.addEventListener('theme-uninstall', spy);
      return element._uninstall()
      .then(() => {
        assert.isTrue(spy.called, 'Event called');
        assert.equal(spy.args[0][0].detail.name, element.activeTheme);
      });
    });

    it('opens error when theme-uninstall event is not handled', async () => {
      await element._uninstall()
      assert.isTrue(element.shadowRoot.querySelector('#errorToast').opened);
    });

    it('Opens noModel toast when event is not handled', () => {
      element._uninstall().catch(() => {});
      assert.isTrue(element.shadowRoot.querySelector('#errorToast').opened);
    });

    it('Sets _installPending property', () => {
      window.addEventListener('theme-uninstall', handler);
      element._uninstall().catch(() => {});
      assert.isTrue(element._installPending);
    });

    it('Resets _installPending property', () => {
      window.addEventListener('theme-uninstall', handler);
      return element._uninstall()
      .then(() => {
        assert.isFalse(element._installPending);
      });
    });

    it('Resets _installPending property when process error', () => {
      window.addEventListener('theme-uninstall', errorHandler);
      return element._uninstall()
      .then(() => {
        assert.isFalse(element._installPending);
      });
    });

    it('Calles _handleException() when process error', () => {
      window.addEventListener('theme-uninstall', errorHandler);
      const spy = sinon.spy(element, '_handleException');
      return element._uninstall()
      .then(() => {
        assert.isTrue(spy.called);
      });
    });

    it('Calls _dispatchActivateEvent()', () => {
      window.addEventListener('theme-uninstall', handler);
      const spy = sinon.spy(element, '_dispatchActivateEvent');
      return element._uninstall()
      .then(() => {
        assert.isTrue(spy.called, 'Event called');
      });
    });
  });
});
