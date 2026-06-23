const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/postgres");

const Url = sequelize.define("Url", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customShort: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  longUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shortUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  maxClicks: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  qrCode: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  favicon: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  workspaceId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "workspaces",
      key: "id",
    },
  },
}, {
  tableName: 'urls',
  timestamps: true,
});

module.exports = Url;
