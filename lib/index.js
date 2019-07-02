'use strict';

const path = require('path');
const fs = require('fs');
const RouterFactory = require('../app/factory');
const requireAll = require('./requireall');

module.exports = function(app, config) {
  const Factory = loadFactory(app, config.factoryFile);
  const factory = new Factory(app);

  const routers = loadRouters(app, config.routerPath);
  for (const key in routers) {
    factory.load(key, routers[key]);
  }

  app.routerFactory = factory;
};

function loadRouters(app, routerPath) {
  const routerDirs = app.loader.getLoadUnits().map(unit => path.join(unit.path, 'app', routerPath));
  const obj = {};
  for (const dir of routerDirs) {
    if (fs.existsSync(dir)) {
      requireAll(dir, '', obj);
    }
  }

  return obj;
}

function loadFactory(app, factoryFile) {
  const factoryFiles = app.loader.getLoadUnits().map(unit => path.join(unit.path, 'app', factoryFile + '.js'));
  const len = factoryFiles.length;
  for (let i = len - 1; i >= 0; i--) {
    const file = factoryFiles[i];
    if (fs.existsSync(file)) {
      return require(file);
    }
  }
  return RouterFactory;
}
