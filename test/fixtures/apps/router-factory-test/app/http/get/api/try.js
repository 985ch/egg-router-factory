'use strict';

module.exports = () => {
  return {
    async controller() {
      this.body = 'test success';
    },
  };
};
