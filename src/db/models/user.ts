'use strict';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../dbConnect';
import { UserAttributes } from '../../types/userTypes';

const Users = sequelize.define<Model<UserAttributes>>('users', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true
  },
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
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
    type: DataTypes.STRING,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  dob: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  refreshToken: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  modelName: 'users',
  timestamps: true,
});

export default Users;