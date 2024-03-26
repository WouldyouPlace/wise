import * as path from 'path';

export function getRootPath() {
  return path.resolve(__dirname, '../../');
}

export function getPkgVersion() {
  return require(path.join(getRootPath(), 'package.json')).version;
}

export function printPkgVersion() {
  const taroVersion = getPkgVersion();
  console.log(`WouldYouPlace v${ taroVersion }`);
  console.log();   // 隔行
}