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

const menuOptions = [
  {
    name: 'menuOptions',
    message: 'What would you like to do?',
    type: 'list',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
  }
];

function init() {
  inquirer
    .prompt(menuOptions)
    
};

function viewAllEmployees() {};

function addEmployee() {};

function updateEmployeeRole() {};

function viewAllRoles() {};

function addRole() {};

function viewAllDepartments() {};

function addDepartment() {};

function quit() {};

init();