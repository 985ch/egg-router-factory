'use strict';

const _ = require('lodash');
const RouterFactoryError = require('../lib/error');

const methods = [ 'head', 'options', 'get', 'put', 'post', 'patch', 'delete' ];

class RouterFactory {
  constructor(app) {
    this.app = app;
    this.routers = [];
  }
  // 根据路径和模块生成路由配置数组
  load(key, _module) {
    const { method, path } = this.getMethodAndPath(key);
    this.routers.push({ key, method, path, module: _module });
  }
  // 从文件路径获取接口方法和接口路径
  getMethodAndPath(key) {
    const tmpKey = key.toLowerCase();
    const n = tmpKey.indexOf('/', 1);
    if (n < 0) throw new RouterFactoryError('can not get method from path:' + key);

    const method = tmpKey.substring(1, n);
    const path = key.substring(n);
    if (methods.indexOf(method) < 0) throw new RouterFactoryError('invaild method name:' + method);

    return { method, path };
  }
  // 创建所有路由
  buildAllRouters(router) {
    for (let i = 0; i < this.routers.length; i++) {
      const obj = this.routers[i];

      const item = _.isFunction(obj.module) ? obj.module(this.app) : obj.module;
      if (_.isNull(item) || _.isUndefined(item)) return;
      if (!_.isObject(item)) throw new RouterFactoryError('invaild router configuration file:[]' + obj.key);

      obj.item = item;
      this.build(router, obj, item);
    }
  }
  // 创建具体路由
  build(router, obj, item) {
    const args = [];
    if (item.name)args.push(item.name);
    const path = item.path || obj.path;
    args.push(path);
    this.setMiddlewares(item, args);
    args.push(item.controller || path);
    router[obj.method](...args);
  }
  // 根据配置把中间件添加到参数
  setMiddlewares(obj, args) {
    const app = this.app;
    for (const key in obj) {
      if (key === 'name' || key === 'path' || key === 'controller') continue;
      args.push(app.middlewares[key](obj[key]));
    }
  }
  // 根据路由数据生成文档
  buildDoc() {
    let text = '';
    for (let i = 0; i < this.routers.length; i++) {
      const obj = this.routers[i];
      text += `[${obj.method}]${obj.item.path || obj.path}\n`;
    }
    return text;
  }
}

module.exports = RouterFactory;
