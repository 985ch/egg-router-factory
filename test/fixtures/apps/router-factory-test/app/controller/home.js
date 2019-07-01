'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, ' + this.app.plugins.routerFactory.name;
  }
  async test() {
    this.ctx.body = 'test success';
  }
}

module.exports = HomeController;
