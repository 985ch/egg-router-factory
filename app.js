'use strict';

const _ = require('lodash');
const init = require('./lib');

module.exports = app => {
  const config = _.extend({
    routerPath: 'http',
    factoryFile: 'factory',
  }, app.config.routerFactory || {});

  return init(app, config);
};
