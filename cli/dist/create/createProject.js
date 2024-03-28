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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const shelljs_1 = __importDefault(require("shelljs"));
function createProject(options) {
    return new Promise((resolve) => {
        var _a;
        const { framework = 'Vue', css, typescript, } = options;
        let tempFileName = `${framework.toLowerCase()}_template`;
        switch (framework) {
            case "Vue" /* FrameworkType.Vue */:
                tempFileName += '_2';
                break;
            case "Vue3" /* FrameworkType.Vue3 */:
                tempFileName += '_3';
                break;
        }
        if (typescript) {
            tempFileName += '_ts';
        }
        const tmpSource = path.join(options.templatePath, tempFileName);
        const jsonUrl = path.join(tmpSource, 'package.json');
        const packageData = fs.readJsonSync(jsonUrl);
        packageData.name = options.projectName;
        packageData.name = options.description;
        if (css !== "None" /* CSSType.None */) {
            if (css === "Less" /* CSSType.Less */) {
                packageData.devDependencies['less'] = '^4.2.0';
                packageData.devDependencies['less-loader'] = '^12.2.0';
            }
            else if (css === "Sass" /* CSSType.Sass */) {
                packageData.devDependencies['sass'] = '^1.72.0';
                packageData.devDependencies['sass-loader'] = '^14.1.1';
            }
            fs.writeJsonSync(jsonUrl, packageData, { spaces: 2 });
        }
        const projectPath = path.join(options.projectRoot, options.projectName || tempFileName);
        fs.copySync(tmpSource, projectPath);
        fs.removeSync(options.templatePath);
        const shellNpm = `${((_a = options.npm) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'npm'} install`;
        console.log(chalk_1.default.grey(`开始安装依赖，运行${shellNpm}`));
        shelljs_1.default.cd(projectPath);
        shelljs_1.default.exec(shellNpm);
        resolve('success');
    });
}
exports.default = createProject;
