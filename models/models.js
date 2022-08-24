const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  diskSpace: {
    type: DataTypes.INTEGER,
    defaultValue: 1024 ** 3
  },
  usedSpace: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  avatar: {
    type: DataTypes.STRING
  }
});

const File = sequelize.define("file", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  accessLink: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING, allowNull: false },
  path: { type: DataTypes.STRING, defaultValue: "" },
  size: { type: DataTypes.INTEGER, defaultValue: 0 }
});

User.hasMany(File, {
  as: "userFiles",
  foreignKey: {
    allowNull: false
  }
});
File.belongsTo(User);
User.hasOne(File, {
  as: "rootDir",
  foreignKey: "rootUserId"
});
File.belongsTo(User, {foreignKey: "rootUserId"});
File.hasMany(File, { foreignKey: "parentId", as: "children" });
File.belongsTo(File, { foreignKey: "parentId" });

module.exports = {
  User,
  File
};
