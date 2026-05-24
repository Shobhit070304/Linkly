const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/postgres");

const Click = sequelize.define("Click", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  urlId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'urls',
      key: 'id',
    },
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  device: {
    type: DataTypes.STRING,
    allowNull: true, // Desktop, Mobile, Tablet
  },
  browser: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  os: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  referrer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clickedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'clicks',
  timestamps: false, // We only need clickedAt
});

module.exports = Click;
