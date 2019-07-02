# egg-router-factory

![node version][node-image]
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[node-image]: https://img.shields.io/badge/node-%3E%3D8-blue.svg
[npm-image]: https://img.shields.io/npm/v/egg-router-factory.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-router-factory
[travis-image]: https://img.shields.io/travis/eggjs/egg-router-factory.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-router-factory
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-router-factory.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-router-factory?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-router-factory.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-router-factory
[download-image]: https://img.shields.io/npm/dm/egg-router-factory.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-router-factory

This plugin provides the ability to read files from a specified directory and create routes based on the contents of the files. It can also easily load and configure different middleware by writing your own RouterFactory class, and simply generate API documents.

## [中文说明](./README.zh_CN.md)
## Install

```bash
$ npm i egg-router-factory --save
```

## Usage
1. Create the required files
```
app
+-- http
|   +-- get
|   |   +--index.js
|   |   +--yourpage.js
|   +-- post
|       +--api
|          +--yourapi.js
+-- factory.js
```
2. Enable plugin
```js
// {app_root}/config/plugin.js
exports.routerFactory = {
  enable: true,
  package: 'egg-router-factory',
};
```
3. Write your own factory class. In most cases, we only need to inherit [RouterFactory](./app/factory.js) and override the setMiddlewares and buildDoc methods.
```js
// {app_root}/app/factory.js
'use strict';
const RouterFactory = require('egg-router-factory');

class MyFactory extends RouterFactory {
  // Add middleware one by one according to the configuration
  setMiddlewares(obj, args) {
    if(obj.params) {
      args.push(app.middlewares.ajvValidate(obj.params));
    }
    if(obj.userauth) {
      args.push(app.middlewares.userauth(obj.userauth));
    }
    args.push(app.middlewares.onError);
  }
  // Generate documents based on route configuration
  buildDoc() {
    let text = '';
    for (let i = 0; i < this.routers.length; i++) {
      const obj = this.routers[i];
      text += `[${obj.method}]${obj.item.path || obj.path}\n`;
      if(obj.item.params){
        text += params2doc(obj.item.params);
      }
      if(obj.item.userauth){
        text += userauth2doc(obj.item.userauth);
      }
    }
    return text;
  }
}
```
4. Write your router files
```js
// {app_root}/app/http/get/index.js
'use strict';

module.exports = {
  path: '/',
  controller: 'home.index',
}
```
```js
// {app_root}/app/http/get/yourpage.js
module.exports = app => {
  params: { /* some params configuration */ },
  controller: app.controller.home.yourpage,
}
```
```js
// {app_root}/app/http/post/api/yourapi.js
module.exports = () => {
  params: { /* some params configuration */ },
  userauth: { /* some auth configuration */ },
  async controller() {
    /* do something here */
    this.body = 'success';
  },
}
```
5. Run buildAllRouters in router.js
```js
// {app_root}/app/router.js
'use strict';
module.exports = app => {
  app.routerFactory.buildAllRouters(app.router);
};
```
6. Complete! You can also call buildDoc to generate documentation in test cases or elsewhere if needed.

## Router file
Router configuration file supports two formats
* Export a function containing the unique parameter app, which returns a configuration JSON
* Export a configuration JSON directly

## Router file default properties
| property | required | description |
|:---------|:---------|:------------|
| controller | true | It can be a string corresponding to the controller, a controller function, or a non-parameter asynchronous function. When it is an asynchronous function with no arguments, the this pointer points to the current ctx. |
| name | false | Route name, can be omitted |
| path | false | Route path, the default is to use the relative path of the configuration file as the route path. |

## Configuration

see [config/config.default.js](config/config.default.js) for more detail.

## Unit tests

```sh
npm test
```

## License

[MIT](LICENSE)<br />
This README was translate by [google](https://translate.google.cn)
