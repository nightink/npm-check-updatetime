'use strict';

const utility = require('../util');

describe('util.js', () => {
  describe('getPackageNpmUri', () => {
    const opt = {
      registry: 'https://registry.npm.taobao.org/',
    };

    it('getPackageNpmUri should work', () => {
      utility.getPackageNpmUri({
        name: 'npm-check-updatetime',
        spec: '>=0.1.0',
      }, opt).should.be.eql(`${opt.registry}npm-check-updatetime/%3E%3D0.1.0`);
    });

    it('pkg info have @', () => {
      utility.getPackageNpmUri({
        name: '@nightink/npm-check-updatetime',
        spec: '>=0.1.0',
      }, opt).should.be.eql(`${opt.registry}@nightink%2Fnpm-check-updatetime/%3E%3D0.1.0`);
    });
  });
});
