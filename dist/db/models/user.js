'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConnect_1 = __importDefault(require("../dbConnect"));
const Users = dbConnect_1.default.define('users', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
            is: {
                args: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                msg: 'Invalid email address format'
            }
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    img: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    dob: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    refreshToken: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
}, {
    modelName: 'users',
    timestamps: true,
});
exports.default = Users;
