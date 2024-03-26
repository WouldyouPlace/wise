import * as path from 'path';
import * as semver from 'semver';
import * as os from 'os';
import * as fs from 'fs';

export function getRootPath() {
  return path.resolve(__dirname, '../../');
}

export function getPkgVersion() {
  return require(path.join(getRootPath(), 'package.json')).version;
}

export function checkNodeVersion() {
  return semver.lt(process.version, 'v7.6.0');
}

export function printPkgVersion() {
  const taroVersion = getPkgVersion();
  console.log(`WouldYouPlace v${ taroVersion }`);
  console.log();   // 隔行
}
export function clearConsole () {
  const readline = require('readline')
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
  }
}
// 获取系统管理员目录
export function getUserHomeDir() {
  function homedir() {
    const env = process.env;
    const home = env.HOME;
    const user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;
    if (process.platform === 'win32') {
      return env.USERPROFILE || '' + env.HOMEDRIVE + env.HOMEPATH || home || '';
    }
    if (process.platform === 'darwin') {
      return home || (user ? '/Users/' + user : '');
    }
    if (process.platform === 'linux') {
      return home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : ''));
    }
    return home || '';
  }
  return typeof os.homedir === 'function' ? os.homedir() : homedir();
}

export function getTemplateSourceType (url: string) {
  if (/^github:/.test(url) || /^gitlab:/.test(url) || /^direct:/.test(url)) {
    return 'git'
  } else {
    return 'url'
  }
}
interface FileStat {
  name: string
  isDirectory: boolean
  isFile: boolean
}
export function readDirWithFileTypes (folder: string): FileStat[] {
  const list = fs.readdirSync(folder)
  const res = list.map(name => {
    const stat = fs.statSync(path.join(folder, name))
    return {
      name,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile()
    }
  })
  return res
}
function getRootPath() {
  return path.resolve(__dirname, '../../');
}