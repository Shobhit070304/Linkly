require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    
    // Import models after connection
    const User = require("../models/user-model");
    const Url = require("../models/url-model");
    const Click = require("../models/click-model");
    
    // Setup associations
    User.hasMany(Url, { foreignKey: 'userId', as: 'urls' });
    Url.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Url.hasMany(Click, { foreignKey: 'urlId', as: 'clickEvents', onDelete: 'CASCADE' });
    Click.belongsTo(Url, { foreignKey: 'urlId', as: 'url' });
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
