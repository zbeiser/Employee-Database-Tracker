const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "business_db"
  },
  console.log(`Connected to the business_db database.`)
);

