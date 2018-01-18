/* global chance */
var DataModel = {};
DataModel.defaultTheme = {
  name: 'Default theme',
  description: 'Advanced REST Client default theme',
  main: 'arc-theme.html',
  path: 'detault-theme/arc-theme.html',
  author: 'The Advanced REST client authors <arc@mulesoft.com>',
  _id: '1234abc'
};
DataModel.genThemeInfo = function() {
  var name = chance.word();
  return {
    name: name + ' theme',
    description: chance.sentence(),
    main: 'arc-theme.html',
    path: name + '/arc-theme.html',
    author: chance.name(),
    _id: chance.word()
  };
};
DataModel.generateThemes = function(e) {
  e.preventDefault();
  var themes = [DataModel.defaultTheme];
  for (var i = 0; i < 5; i++) {
    themes.push(DataModel.genThemeInfo());
  }
  e.detail.result = Promise.resolve(themes);
};
DataModel.activeThemeInfo = function(e) {
  e.preventDefault();
  e.detail.result = Promise.resolve(DataModel.defaultTheme._id);
};
DataModel.listen = function() {
  window.addEventListener('themes-list', DataModel.generateThemes);
  window.addEventListener('theme-active-info', DataModel.activeThemeInfo);
};

DataModel.unlisten = function() {
  window.removeEventListener('themes-list', DataModel.generateThemes);
  window.removeEventListener('theme-active-info', DataModel.activeThemeInfo);
};
