require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize');

var DB_HOST=process.env.DB_HOST
var DB_USER=process.env.DB_USER
var DB_PASS=process.env.DB_PASS
var DB_NAME=process.env.DB_NAME

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
	// disable logging; default: console.log
  logging: false,
	// dialectOptions: {
	// 	useUTC: true, // -->Add this line. for reading from database
	// },
	timezone: '+07:00',
});

sequelize.SELECT = QueryTypes.SELECT
sequelize.INSERT = QueryTypes.INSERT
sequelize.UPDATE = QueryTypes.UPDATE
sequelize.DELETE = QueryTypes.DELETE

module.exports = sequelize