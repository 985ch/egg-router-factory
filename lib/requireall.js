'use strict';

const path = require('path');
const fs = require('fs');

function requireAll(pathname, prefix = '', obj = {}) {
  const files = fs.readdirSync(pathname);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const newpath = path.join(pathname, file);
    const stat = fs.lstatSync(newpath);
    const key = prefix + '/' + (file === 'index.js' ? '' : path.basename(file, '.js'));
    if (stat.isFile()) {
      if (path.extname(file) === '.js') {
        obj[key] = require(newpath);
      }
    } else if (stat.isDirectory()) {
      requireAll(newpath, key, obj);
    }
  }
}

module.exports = requireAll;
