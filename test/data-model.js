import '../../../chance/chance.js';
/* global chance */
export const DataModel = {};
DataModel.defaultTheme = {
  description: 'Advanced REST Client default theme',
  isDefault: true,
  location: '@advanced-rest-client/arc-electron-default-theme',
  mainFile: '@advanced-rest-client/arc-electron-default-theme/arc-electron-default-theme.html',
  name: '@advanced-rest-client/arc-electron-default-theme',
  _id: 'advanced-rest-client/arc-electron-default-theme',
  title: 'Default theme',
  version: '2.0.0'
};

DataModel.genThemeInfo = function() {
  const name = chance.word();
  const id = chance.word();
  return {
    name: id,
    _id: id,
    description: chance.sentence(),
    title: name,
    location: id,
    mainFile: id + '/theme.html',
    version: '1.0.0',
    isDefault: false
  };
};

DataModel.generateThemes = function() {
  const themes = [DataModel.defaultTheme];
  for (let i = 0; i < 4; i++) {
    themes.push(DataModel.genThemeInfo());
  }
  return themes;
};

DataModel.generateThemesHandler = function(e) {
  e.preventDefault();
  e.detail.result = Promise.resolve(DataModel.generateThemes());
};

DataModel.activeThemeInfo = function(e) {
  e.preventDefault();
  e.detail.result = Promise.resolve(DataModel.defaultTheme);
};

DataModel.listen = function() {
  window.addEventListener('themes-list', DataModel.generateThemesHandler);
  window.addEventListener('theme-active-info', DataModel.activeThemeInfo);
};

DataModel.unlisten = function() {
  window.removeEventListener('themes-list', DataModel.generateThemesHandler);
  window.removeEventListener('theme-active-info', DataModel.activeThemeInfo);
};
