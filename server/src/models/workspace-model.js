const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/postgres");

const Workspace = sequelize.define("Workspace", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  // We store the SHA-256 hash of the API key, never the plaintext.
  apiKeyHash: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "workspaces",
  timestamps: true,
});

module.exports = Workspace;
