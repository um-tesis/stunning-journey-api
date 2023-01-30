"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validPassword = exports.compare = exports.hashPassword = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config/config"));
const { SALT_ROUNDS } = config_1.default;
const hashPassword = (password) => {
    const salt = bcryptjs_1.default.genSaltSync(+SALT_ROUNDS);
    return bcryptjs_1.default.hashSync(password, salt);
};
exports.hashPassword = hashPassword;
const compare = (password, hash) => bcryptjs_1.default.compareSync(password, hash);
exports.compare = compare;
const hasLowercase = (password) => /.*[a-z].*/.test(password);
const hasUppercase = (password) => /.*[A-Z].*/.test(password);
const hasNumber = (password) => /.*[0-9].*/.test(password);
const hasSpecialCharacter = (password) => /[^a-zA-Z0-9]/.test(password);
const validPassword = (password) => hasLowercase(password) &&
    hasUppercase(password) &&
    hasNumber(password) &&
    hasSpecialCharacter(password);
exports.validPassword = validPassword;
//# sourceMappingURL=crypto.helper.js.map