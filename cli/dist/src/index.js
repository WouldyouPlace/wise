"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = __importDefault(require("./cli"));
const project_1 = __importDefault(require("./create/project"));
exports.default = {
    CLI: cli_1.default,
    Project: project_1.default
};
