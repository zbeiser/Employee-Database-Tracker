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
    name: "menu",
    message: "What would you like to do?",
    type: "list",
    choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
  }
];

const addEmployeeQuestions = [
  {
    name: "firstName",
    message: "What is the employee's first name?",
    type: "input",
  },
  {
    name: "lastName",
    message: "What is the employee's last name?",
    type: "input",
  },
  {
    name: "role",
    message: "What is the employee's role?",
    type: "list",
    choices: []
  },
  {
    name: "manager",
    message: "Who is the employee's manager?",
    type: "list",
    choices: []
  },
];

const updateEmployeeRoleQuestions = [
  {
    name: "employee",
    message: "Which employee's role do you want to update?",
    type: "list",
    choices: []
  },
  {
    name: "role",
    message: "Which role do you want to assign the selected employee?",
    type: "list",
    choices: []
  }
];

const addRoleQuestions = [
  {
    name: "role",
    message: "What is the name of the role?",
    type: "input",
  },
  {
    name: "salary",
    message: "What is the salary of the role?",
    type: "input",
  },
  {
    name: "department",
    message: "What department does the role belong to?",
    type: "list",
    choices: getDepartmentNames()
  }
];

const addDepartmentQuestion = [
  {
    name: "department",
    message: "What is the name of the department?",
    type: "input",
  }
];

function menu() {
  inquirer
    .prompt(menuOptions)
    .then(response => {
      if (response.menu === "View All Employees") {
        viewAllEmployees();
      } else if (response.menu === "Add Employee") {
        addEmployee();
      } else if (response.menu === "Update Employee Role") {
        updateEmployeeRole();
      } else if (response.menu === "View All Roles") {
        viewAllRoles();
      } else if (response.menu === "Add Role") {
        addRole();
      } else if (response.menu === "View All Departments") {
        viewAllDepartments();
      } else if (response.menu === "Add Department") {
        addDepartment();
      } else if (response.menu === "Quit") {
        quit();
      }
    })
};

function viewAllEmployees() {
  const employees = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
  db.promise().query(employees)
    .then(([rows,fields]) => {
      console.table(rows);
    })
    .then(() => menu());
};

function addEmployee() {};

function updateEmployeeRole() {};

function viewAllRoles() {
  const roles = "SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON department.id = role.department_id;"
  db.promise().query(roles)
    .then(([rows,fields]) => {
      console.table(rows);
    })
    .then(() => menu());
};

function addRole() {
  inquirer
    .prompt(addRoleQuestions)
    .then(response => {

    })
};

function viewAllDepartments() {
  const departments = "SELECT * FROM department";
  db.promise().query(departments)
    .then(([rows,fields]) => {
      console.table(rows);
    })
    .then(() => menu());
};

function addDepartment() {
  inquirer
    .prompt(addDepartmentQuestion)
    .then(response => {
      db.promise().query("INSERT INTO department (name) VALUES (?)", response.department)
      .then(console.info("Added " + response.department + " to the database"));
    })
    .then(() => menu());
};

function getDepartmentNames() {
  const departments = "SELECT name FROM department"
  db.promise().query(departments)
    .then(([rows,fields]) => {
      let depArray = [];
      for (let i = 0; i < rows.length; i++) {
        depArray.push(rows[i].name);
      }
      return depArray;
    })
}

function quit() {
  process.exit();
};

menu();