/**
 * Copyright(c) cnpm and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

const debug = require('debug')('npm-check-updatetime:util');
const utility = require('utility');

const url = require('url');

function getPackageNpmUri(pkg, options) {
  let name = pkg.name;
  if (name[0] === '@') {
    // dont encodeURIComponent @ char, it will be 405
    // https://registry.npmjs.org/%40rstacruz%2Ftap-spec/%3E%3D4.1.1
    name = '@' + utility.encodeURIComponent(name.substring(1));
  } else {
    name = utility.encodeURIComponent(name);
  }
  const pkgUrl = url.resolve(options.registry, name + '/' + utility.encodeURIComponent(pkg.spec));
  debug('[%s@%s] GET %j', pkg.name, pkg.spec, pkgUrl);
  return pkgUrl;
}

exports.getPackageNpmUri = getPackageNpmUri;
