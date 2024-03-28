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
const inquirer = __importStar(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs-extra"));
const ora_1 = __importDefault(require("ora"));
const path = __importStar(require("path"));
const request = __importStar(require("request"));
const fetchTemplate_1 = __importDefault(require("./fetchTemplate"));
const index_1 = require("../config/index");
const utils_1 = require("../utils");
const createProject_1 = __importDefault(require("./createProject"));
class Project {
    constructor(options) {
        this.conf = {};
        this._rootPath = '';
        // 项目名称
        this.askProjectName = function (conf, prompts) {
            if ((typeof conf.projectName) !== 'string') {
                prompts.push({
                    type: 'input',
                    name: 'projectName',
                    message: '请输入项目名称：',
                    validate(input) {
                        if (!(input || input.trim())) {
                            return '项目名不能为空！';
                        }
                        // 查找文件是否存在
                        if (fs.existsSync(input)) {
                            return '当前目录已经存在同名项目，请换一个项目名！';
                        }
                        return true;
                    }
                });
            }
            else if (fs.existsSync(conf.projectName)) {
                prompts.push({
                    type: 'input',
                    name: 'projectName',
                    message: '当前目录已经存在同名项目，请换一个项目名！',
                    validate(input) {
                        if (!input) {
                            return '项目名不能为空！';
                        }
                        if (fs.existsSync(input)) {
                            return '项目名依然重复！';
                        }
                        return true;
                    }
                });
            }
        };
        // 项目描述
        this.askDescription = function (conf, prompts) {
            if (typeof conf.description !== 'string') {
                prompts.push({
                    type: 'input',
                    name: 'description',
                    message: '请输入项目介绍：'
                });
            }
        };
        // 是否使用ts
        this.askTypescript = function (conf, prompts) {
            if (typeof conf.typescript !== 'boolean') {
                prompts.push({
                    type: 'confirm',
                    name: 'typescript',
                    message: '是否需要使用 TypeScript ？'
                });
            }
        };
        // css
        this.askCSS = function (conf, prompts) {
            if (typeof conf.css !== 'string') {
                prompts.push({
                    type: 'list',
                    name: 'css',
                    message: '请选择 CSS 预处理器（Sass/Less）',
                    choices: [
                        {
                            name: 'Sass',
                            value: "Sass" /* CSSType.Sass */
                        },
                        {
                            name: 'Less',
                            value: "Less" /* CSSType.Less */
                        },
                        {
                            name: '无',
                            value: "None" /* CSSType.None */
                        }
                    ]
                });
            }
        };
        // 打包工具
        this.askCompiler = function (conf, prompts) {
            if (typeof conf.compiler !== 'string') {
                prompts.push({
                    type: 'list',
                    name: 'compiler',
                    message: '请选择编译工具',
                    choices: [
                        {
                            name: 'Webpack5',
                            value: "Webpack5" /* CompilerType.Webpack5 */
                        },
                        {
                            name: 'Vite',
                            value: "Vite" /* CompilerType.Vite */
                        }
                    ]
                });
            }
        };
        // 框架
        this.askFramework = function (conf, prompts) {
            if (typeof conf.framework !== 'string') {
                prompts.push({
                    type: 'list',
                    name: 'framework',
                    message: '请选择框架',
                    choices: [
                        {
                            name: 'React',
                            value: "React" /* FrameworkType.React */
                        },
                        {
                            name: 'Vue2',
                            value: "Vue" /* FrameworkType.Vue */
                        },
                        {
                            name: 'Vue3',
                            value: "Vue3" /* FrameworkType.Vue3 */
                        }
                    ]
                });
            }
        };
        // 安装依赖的方式
        this.askNpm = function (conf, prompts) {
            if (typeof conf.npm !== 'string') {
                prompts.push({
                    type: 'list',
                    name: 'npm',
                    message: '请选择包管理工具',
                    choices: [
                        {
                            name: 'yarn',
                            value: "Yarn" /* NpmType.Yarn */
                        },
                        {
                            name: 'pnpm',
                            value: "Pnpm" /* NpmType.Pnpm */
                        },
                        {
                            name: 'npm',
                            value: "Npm" /* NpmType.Npm */
                        },
                        {
                            name: 'cnpm',
                            value: "Cnpm" /* NpmType.Cnpm */
                        }
                    ]
                });
            }
        };
        this.askTemplate = function (conf, prompts, list = []) {
            if (typeof conf.template !== 'string') {
                prompts.push({
                    type: 'list',
                    name: 'template',
                    message: '请选择模板',
                    choices: [
                        {
                            name: '默认模板',
                            value: 'cli_template'
                        }
                    ]
                });
            }
        };
        const unSupportedVer = (0, utils_1.checkNodeVersion)();
        if (unSupportedVer) {
            throw new Error('Node.js 版本过低，推荐升级 Node.js 至 v8.0.0+');
        }
        this._rootPath = path.resolve(path.join((0, utils_1.getRootPath)()));
        this.conf = Object.assign({
            projectName: '',
            projectDir: '',
            template: '',
            description: '',
            npm: ''
        }, options);
    }
    init() {
        (0, utils_1.clearConsole)();
        console.log(chalk_1.default.green('即将创建一个新项目!'));
        console.log();
        this.create();
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const answers = yield this.ask();
                const date = new Date();
                this.conf = Object.assign(this.conf, answers);
                this.conf.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                this.write();
            }
            catch (error) {
                console.log(chalk_1.default.red('创建项目失败: ', error));
            }
        });
    }
    ask() {
        return __awaiter(this, void 0, void 0, function* () {
            let prompts = [];
            const conf = this.conf;
            this.askProjectName(conf, prompts);
            this.askDescription(conf, prompts);
            this.askFramework(conf, prompts);
            this.askTypescript(conf, prompts);
            this.askCSS(conf, prompts);
            // 打包方式
            // this.askCompiler(conf, prompts)
            this.askNpm(conf, prompts);
            // 模板来源
            // await this.askTemplateSource(conf, prompts)
            const answers = yield inquirer.prompt(prompts);
            prompts = [];
            const templates = yield this.fetchTemplates(answers);
            yield this.askTemplate(conf, prompts, templates);
            const templateChoiceAnswer = yield inquirer.prompt(prompts);
            return Object.assign(Object.assign({}, answers), templateChoiceAnswer);
        });
    }
    fetchTemplates(answers) {
        return __awaiter(this, void 0, void 0, function* () {
            const { framework } = answers;
            this.conf.templateSource = this.conf.templateSource || index_1.DEFAULT_TEMPLATE_SRC;
            // 从模板源下载模板
            const isClone = /gitee/.test(this.conf.templateSource) || this.conf.clone;
            const templateChoices = yield (0, fetchTemplate_1.default)(this.conf.templateSource, this.templatePath(''), isClone);
            // 根据用户选择的框架筛选模板
            return templateChoices.filter(templateChoice => {
                var _a;
                const { platforms } = templateChoice;
                if (typeof platforms === 'string' && platforms) {
                    return framework === templateChoice.platforms;
                }
                else if (Array.isArray(platforms)) {
                    return (_a = templateChoice.platforms) === null || _a === void 0 ? void 0 : _a.includes(framework);
                }
                else {
                    return true;
                }
            });
        });
    }
    templatePath(...args) {
        let filepath = path.join.apply(path, args);
        if (!path.isAbsolute(filepath)) {
            filepath = path.join(this._rootPath, 'templates', filepath);
        }
        return filepath;
    }
    write() {
        const { projectName, projectDir, template, autoInstall = true, framework, npm } = this.conf;
        // 引入模板编写者的自定义逻辑
        const templatePath = this.templatePath(template);
        (0, createProject_1.default)({
            projectRoot: projectDir,
            projectName,
            template,
            npm,
            framework,
            css: this.conf.css || "None" /* CSSType.None */,
            autoInstall: autoInstall,
            templateRoot: (0, utils_1.getRootPath)(),
            version: (0, utils_1.getPkgVersion)(),
            typescript: this.conf.typescript,
            date: this.conf.date,
            description: this.conf.description,
            compiler: this.conf.compiler,
            templatePath: templatePath
        }).then(() => { });
    }
}
function getOpenSourceTemplates(platform) {
    return new Promise((resolve, reject) => {
        const spinner = (0, ora_1.default)({ text: '正在拉取开源模板列表...', discardStdin: false }).start();
        request.get('https://gitee.com/NervJS/awesome-taro/raw/next/index.json', (error, _response, body) => {
            if (error) {
                spinner.fail(chalk_1.default.red('拉取开源模板列表失败！'));
                return reject(new Error());
            }
            spinner.succeed(`${chalk_1.default.grey('拉取开源模板列表成功！')}`);
            const collection = JSON.parse(body);
            switch (platform) {
                case 'react':
                    return resolve(collection.react);
                case 'vue':
                    return resolve(collection.vue);
                default:
                    return resolve(['无可用模板']);
            }
        });
    });
}
exports.default = Project;
