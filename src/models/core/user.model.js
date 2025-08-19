'use strict';
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize) => {
  class User extends Model {
    validPassword(password) { return bcrypt.compareSync(password, this.password_hash); }
  }
  User.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    password_hash: { type: DataTypes.STRING, allowNull: false },
    roles: { type: DataTypes.JSONB },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          const salt = await require('bcryptjs').genSalt(10);
          user.password_hash = await require('bcryptjs').hash(user.password_hash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          const salt = await require('bcryptjs').genSalt(10);
          user.password_hash = await require('bcryptjs').hash(user.password_hash, salt);
        }
      },
    },
  });
  return User;
};
