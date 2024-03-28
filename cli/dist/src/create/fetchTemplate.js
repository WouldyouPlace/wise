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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adm_zip_1 = __importDefault(require("adm-zip"));
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs-extra"));
const download_git_repo_1 = __importDefault(require("download-git-repo"));
const ora_1 = __importDefault(require("ora"));
const path = __importStar(require("path"));
const request = __importStar(require("request"));
const utils_1 = require("../utils");
const index_1 = require("../config/index");
const TEMP_DOWNLOAD_FOLDER = 'temp';
function fetchTemplate(templateSource, templateRootPath, clone) {
    const type = (0, utils_1.getTemplateSourceType)(templateSource);
    const tempPath = path.join(templateRootPath, TEMP_DOWNLOAD_FOLDER);
    let name;
    let isFromUrl = false;
    // eslint-disable-next-line no-async-promise-executor
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        // 下载文件的缓存目录
        if (fs.existsSync(tempPath)) {
            yield fs.remove(tempPath);
        }
        yield fs.mkdir(tempPath);
        const spinner = (0, ora_1.default)(`正在从 ${templateSource} 拉取远程模板...`).start();
        if (type === 'git') {
            name = path.basename(templateSource);
            (0, download_git_repo_1.default)(templateSource, path.join(tempPath, name), { clone }, (error) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    spinner.color = 'red';
                    spinner.fail(chalk_1.default.red('拉取远程模板仓库失败！'));
                    yield fs.remove(tempPath);
                    return resolve();
                }
                spinner.color = 'green';
                spinner.succeed(`${chalk_1.default.grey('拉取远程模板仓库成功！')}`);
                resolve();
            }));
        }
        else if (type === 'url') {
            // url 模板源，因为不知道来源名称，临时取名方便后续开发者从列表中选择
            name = 'from-remote-url';
            isFromUrl = true;
            const zipPath = path.join(tempPath, name + '.zip');
            request
                .get(templateSource)
                .pipe(fs.createWriteStream(zipPath))
                .on('close', () => {
                // unzip
                const zip = new adm_zip_1.default(zipPath);
                zip.extractAllTo(path.join(tempPath, name), true);
                spinner.color = 'green';
                spinner.succeed(`${chalk_1.default.grey('拉取远程模板仓库成功！')}`);
                resolve();
            })
                .on('error', (err) => __awaiter(this, void 0, void 0, function* () {
                spinner.color = 'red';
                spinner.fail(chalk_1.default.red(`拉取远程模板仓库失败！\n${err}`));
                yield fs.remove(tempPath);
                return resolve();
            }));
        }
    })).then(() => __awaiter(this, void 0, void 0, function* () {
        const templateFolder = name ? path.join(tempPath, name) : '';
        // 下载失败，只显示默认模板
        if (!fs.existsSync(templateFolder))
            return Promise.resolve([]);
        const isTemplateGroup = !(fs.existsSync(path.join(templateFolder, 'package.json')) ||
            fs.existsSync(path.join(templateFolder, 'package.json.tmpl')));
        if (isTemplateGroup) {
            // 模板组
            const files = (0, utils_1.readDirWithFileTypes)(templateFolder)
                .filter(file => !file.name.startsWith('.') && file.isDirectory && file.name !== '__MACOSX')
                .map(file => file.name);
            yield Promise.all(files.map(file => {
                const src = path.join(templateFolder, file);
                const dest = path.join(templateRootPath, file);
                return fs.move(src, dest, { overwrite: true });
            }));
            yield fs.remove(tempPath);
            const res = files.map(name => {
                const creatorFile = path.join(templateRootPath, name, index_1.TEMPLATE_CREATOR);
                if (!fs.existsSync(creatorFile))
                    return { name };
                const { platforms = '', desc = '' } = require(creatorFile);
                return {
                    name,
                    platforms,
                    desc
                };
            });
            return Promise.resolve(res);
        }
        else {
            // 单模板
            yield fs.move(templateFolder, path.join(templateRootPath, name), { overwrite: true });
            yield fs.remove(tempPath);
            let res = { name, desc: isFromUrl ? templateSource : '' };
            const creatorFile = path.join(templateRootPath, name, index_1.TEMPLATE_CREATOR);
            if (fs.existsSync(creatorFile)) {
                const { platforms = '', desc = '' } = require(creatorFile);
                res = {
                    name,
                    platforms,
                    desc: desc || templateSource
                };
            }
            return Promise.resolve([res]);
        }
    }));
}
exports.default = fetchTemplate;
