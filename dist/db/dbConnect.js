"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("./config/config");
const dbOptions = config_1.local;
const sequelize = new sequelize_1.Sequelize(dbOptions);
exports.default = sequelize;
