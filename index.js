'use strict';

/**
 * Module dependencies.
 */

const npa = require('npm-package-arg');
const utility = require('utility');
const chalk = require('chalk');
const co = require('co');
const ms = require('ms');

const get = require('./get');
const utils = require('./util');

const options = {
  registry: 'https://registry.npm.taobao.org/',
  timeout: 60000,
};

function* parseInfo(name, version, parentMod) {
  const p = npa(`${name}@${version}`);
  const pkgUrl = utils.getPackageNpmUri(p, options);
  const result = yield get(pkgUrl, {
    dataType: 'json',
    timeout: options.timeout,
    followRedirect: true,
    gzip: true,
  }, options);

  let chalkStr;
  if (Date.now() - result.data.publish_time <= ms('2d')) {
    chalkStr = chalk.yellow('module %s, updatetime: %s, parent module: %s');
  } else {
    chalkStr = chalk.gray('module %s, updatetime: %s, parent module: %s');
  }

  console.log(chalkStr, `${name}@${version}`,
    utility.YYYYMMDDHHmmss(result.data.publish_time),
    parentMod ? `${parentMod.name}@${parentMod.version}` : null);

  return result.data;
}

function* analyzeModule(pkgInfo) {
  const dependencies = pkgInfo && pkgInfo.dependencies;
  if (!dependencies) {
    // pkgInfo &&
    // console.log(chalk.green('done module %s', `${pkgInfo.name}@${pkgInfo.version}`));
    return;
  }

  const allDeps = [];
  for (const name in dependencies) {
    allDeps.push(parseInfo(name, dependencies[name], pkgInfo));
  }

  const pkgInfos = yield allDeps;
  yield pkgInfos.map(function* (pkgInf) {
    yield analyzeModule(pkgInf);
  });
}

co(function* () {
  const dirPkg = require(`${process.cwd()}/package.json`);
  yield analyzeModule(dirPkg);
}).catch((err) => {
  console.error(err.stack);
});
