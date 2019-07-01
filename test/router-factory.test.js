'use strict';

const mock = require('egg-mock');

describe('test/router-factory.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/router-factory-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, routerFactory')
      .expect(200);
  });
  it('should GET /test', () => {
    return app.httpRequest()
      .get('/test')
      .expect('test success')
      .expect(200);
  });
  it('should GET /api/try', () => {
    return app.httpRequest()
      .get('/api/try')
      .expect('test success')
      .expect(200);
  });
});
