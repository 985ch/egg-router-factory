'use strict';

const path = require('path');
const fs = require('fs');

function requireAll(pathname, prefix = '', obj = {}) {
  const files = fs.readdirSync(pathname);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const newpath = path.join(pathname, file);
    const stat = fs.lstatSync(newpath);
    if (stat.isFile()) {
      if (path.extname(file) === '.js') {
        const key = prefix + '/' + (file === 'index.js' ? '' : path.basename(file, '.js'));
        obj[key] = require(newpath);
      }
    } else if (stat.isDirectory()) {
      requireAll(newpath, prefix + '/' + file, obj);
    }
  }
}

module.exports = requireAll;
