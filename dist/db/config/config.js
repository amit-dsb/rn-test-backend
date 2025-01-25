"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.production = exports.local = exports.development = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const options = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true, // This enforces SSL connection
            rejectUnauthorized: false, // Necessary for Render PostgreSQL SSL configuration
        },
    },
};
exports.development = options;
exports.local = options;
exports.production = options;
exports.default = {
    local: exports.local,
    development: exports.development,
    production: exports.production,
};
