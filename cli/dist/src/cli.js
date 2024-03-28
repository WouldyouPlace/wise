"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist_1 = __importDefault(require("minimist"));
const utils_1 = require("./utils");
const project_1 = __importDefault(require("./create/project"));
class CLI {
    constructor(appPath) {
        this.appPath = appPath || process.cwd();
    }
    run() {
        return this.parseArgs();
    }
    parseArgs() {
        const args = (0, minimist_1.default)(process.argv.slice(2), {
            alias: {
                version: ['v'],
                help: ['h'],
                port: ['p'],
            },
            boolean: ['version', 'help'], // 将值视为布尔值
            default: {
                build: true,
            },
        });
        const _ = args._;
        const command = _[0];
        console.log(args);
        if (command) {
            switch (command) {
                case 'init':
                    {
                        new project_1.default({
                            projectDir: this.appPath,
                            projectName: _[1] || args.name,
                            description: args.description,
                            typescript: args.typescript,
                            framework: args.framework,
                            compiler: args.compiler,
                            npm: args.npm,
                            templateSource: args['template-source'],
                            clone: !!args.clone,
                            template: args.template,
                            css: args.css,
                        }).init();
                    }
                    break;
            }
        }
        else {
            if (args.h) {
                console.log('Usage: taro <command> [options]');
                console.log();
                console.log('Options:');
                console.log('  -v, --version       output the version number');
                console.log('  -h, --help          output usage information');
                console.log();
                console.log('Commands:');
                console.log('  init [projectName]  Init a project with default templete');
                console.log('  config <cmd>        Taro config');
                console.log('  create              Create page for project');
                console.log('  build               Build a project with options');
                console.log('  update              Update packages of taro');
                console.log('  info                Diagnostics Taro env info');
                console.log('  doctor              Diagnose taro project');
                console.log('  inspect             Inspect the webpack config');
                console.log('  help [cmd]          display help for [cmd]');
            }
            else if (args.v) {
                console.log((0, utils_1.getPkgVersion)());
            }
        }
    }
}
exports.default = CLI;
