"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDirWithFileTypes = exports.getTemplateSourceType = exports.getUserHomeDir = exports.clearConsole = exports.printPkgVersion = exports.checkNodeVersion = exports.getPkgVersion = exports.getRootPath = void 0;
const path = __importStar(require("path"));
const semver = __importStar(require("semver"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs-extra"));
function getRootPath() {
    return path.resolve(__dirname, '../../');
}
exports.getRootPath = getRootPath;
function getPkgVersion() {
    return require(path.join(getRootPath(), 'package.json')).version;
}
exports.getPkgVersion = getPkgVersion;
function checkNodeVersion() {
    return semver.lt(process.version, 'v7.6.0');
}
exports.checkNodeVersion = checkNodeVersion;
function printPkgVersion() {
    const taroVersion = getPkgVersion();
    console.log(`WouldYouPlace v${taroVersion}`);
    console.log(); // 隔行
}
exports.printPkgVersion = printPkgVersion;
function clearConsole() {
    const readline = require('readline');
    if (process.stdout.isTTY) {
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
    }
}
exports.clearConsole = clearConsole;
// 获取系统管理员目录
function getUserHomeDir() {
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
exports.getUserHomeDir = getUserHomeDir;
function getTemplateSourceType(url) {
    if (/^github:/.test(url) || /^gitlab:/.test(url) || /^direct:/.test(url)) {
        return 'git';
    }
    else {
        return 'url';
    }
}
exports.getTemplateSourceType = getTemplateSourceType;
function readDirWithFileTypes(folder) {
    const list = fs.readdirSync(folder);
    return list.map((name) => {
        const stat = fs.statSync(path.join(folder, name));
        return {
            name,
            isDirectory: stat.isDirectory(),
            isFile: stat.isFile()
        };
    });
}
exports.readDirWithFileTypes = readDirWithFileTypes;
