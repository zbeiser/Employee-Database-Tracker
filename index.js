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
    name: 'menu',
    message: 'What would you like to do?',
    type: 'list',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
  }
];

function menu() {
  inquirer
    .prompt(menuOptions)
    .then(response => {
      if (response.menu === 'View All Employees') {
        viewAllEmployees();
      } else if (response.menu === 'Add Employee') {
        addEmployee();
      } else if (response.menu === 'Update Employee Role') {
        updateEmployeeRole();
      } else if (response.menu === 'View All Roles') {
        viewAllRoles();
      } else if (response.menu === 'Add Role') {
        addRole();
      } else if (response.menu === 'View All Departments') {
        viewAllDepartments();
      } else if (response.menu === 'Add Department') {
        addDepartment();
      } else if (response.menu === 'Quit') {
        quit();
      }
    })
};

function viewAllEmployees() {};

function addEmployee() {};

function updateEmployeeRole() {};

function viewAllRoles() {};

function addRole() {};

function viewAllDepartments() {
  const departments = "SELECT * FROM department";
  db.promise().query(departments)
    .then(([rows,fields]) => {
      console.table(rows);
    })
    .then(() => menu());
};

function addDepartment() {};

function quit() {
  process.exit();
};

menu();