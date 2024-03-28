import * as path from 'path';
import * as fs from 'fs-extra';
import chalk from "chalk";
import shell from 'shelljs';
import type { IProjectConf } from './project';
import { CustomPartial } from "../types/utils";
import { AnyJson, CSSType, FrameworkType, NpmType } from "../types";

type Options = {
  projectRoot: string;
  autoInstall: boolean;
  templateRoot: string;
  version: string;
  templatePath: string;
} & CustomPartial<IProjectConf, 'projectName' | 'projectDir' | 'template' | 'css' | 'npm' | 'framework' | 'templateSource' | 'description' | 'typescript' | 'date' | 'compiler'>


function createProject(options: Options) {
  return new Promise((resolve) => {
    const { framework = 'Vue', css, typescript, } = options;
    let tempFileName = `${ framework.toLowerCase() }_template`;
    switch (framework) {
      case FrameworkType.Vue:
        tempFileName += '_2';
        break;
      case FrameworkType.Vue3:
        tempFileName += '_3';
        break;
    }
    if (typescript) {
      tempFileName += '_ts';
    }
    const tmpSource = path.join(options.templatePath, tempFileName);
    const jsonUrl = path.join(tmpSource, 'package.json')
    const packageData: AnyJson = fs.readJsonSync(jsonUrl);
    packageData.name = options.projectName;
    packageData.name = options.description;
    if (css !== CSSType.None) {
      if (css === CSSType.Less) {
        packageData.devDependencies['less'] = '^4.2.0';
        packageData.devDependencies['less-loader'] = '^12.2.0';
      } else if (css === CSSType.Sass) {
        packageData.devDependencies['sass'] = '^1.72.0';
        packageData.devDependencies['sass-loader'] = '^14.1.1';
      }
      fs.writeJsonSync(jsonUrl, packageData, { spaces: 2 })
    }
    const projectPath = path.join(options.projectRoot, options.projectName || tempFileName)
    fs.copySync(tmpSource, projectPath);
    fs.removeSync(options.templatePath);
    const shellNpm = `${ options.npm?.toLowerCase() || 'npm'} install`;
    console.log(chalk.grey(`开始安装依赖，运行${ shellNpm }`));
    shell.cd(projectPath);
    shell.exec(shellNpm);
    shell.exit(1);
    resolve('success');
  });
}

export default createProject;