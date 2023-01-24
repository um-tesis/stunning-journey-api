"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../../.env'),
});
const config = {
    PORT: process.env.SERVER_PORT,
    NODE_ENV: process.env.NODE_ENV,
    DB_URL: process.env.DATABASE_URL,
    DB_NAME: process.env.DATABASE_NAME,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
    JWT_ALGORITHM: process.env.JWT_ALGORITHM,
    JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    GRAPHQL_PLAYGROUND: process.env.GRAPHQL_PLAYGROUND,
};
if (require.main === module && process.env.NODE_ENV === 'development') {
    console.log('<<<<<< CONFIG >>>>>', config);
}
exports.default = config;
//# sourceMappingURL=config.js.map