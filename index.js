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
);

// Declaring arrays that will globally store department, role, and employee names for inquirer prompts
let depArray = [];
let roleArray = [];
let empNoneArray = [];
let empArray = [];

// Declaring inquirer prompt questions as variables for better readability of the functions
const menuOptions = [
  {
    name: "menu",
    message: "What would you like to do?",
    type: "list",
    choices: ["View All Employees", "View Employees By Manager", "View Employees By Department", "Add Employee", "Update Employee Role", "Update Employee Manager", "Delete Employee", "View All Roles", "Add Role", "Delete Role", "View All Departments", "View Total Utilized Budget of Department", "Add Department", "Delete Department", "Quit"],
  }
];

const viewEmployeesByManagerQs = [
  {
    name: "manager",
    message: "Which manager's employees would you like to view?",
    type: "list",
    choices: empArray
  }
];

const viewEmployeesByDepartmentQs = [
  {
    name: "department",
    message: "Which department's employees would you like to view?",
    type: "list",
    choices: depArray
  }
];

const addEmployeeQs = [
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
    choices: roleArray
  },
  {
    name: "manager",
    message: "Who is the employee's manager?",
    type: "list",
    choices: empNoneArray
  },
];

const updateEmployeeRoleQs = [
  {
    name: "employee",
    message: "Which employee's role do you want to update?",
    type: "list",
    choices: empArray
  },
  {
    name: "role",
    message: "Which role do you want to assign the selected employee?",
    type: "list",
    choices: roleArray
  }
];

const updateEmployeeManagerQs = [
  {
    name: "employee",
    message: "Which employee's manager do you want to update?",
    type: "list",
    choices: empArray
  },
  {
    name: "manager",
    message: "Which manager do you want to assign the selected employee?",
    type: "list",
    choices: empNoneArray
  }
];

const addRoleQs = [
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
    choices: depArray
  }
];

const addDepartmentQs = [
  {
    name: "department",
    message: "What is the name of the department?",
    type: "input",
  }
];

const deleteDepartmentQs = [
  {
    name: "department",
    message: "Which department do you want to delete?",
    type: "list",
    choices: depArray
  }
];

const viewDepartmentBudgetQs = [
  {
    name: "department",
    message: "Which department's total utilized budget do you want to view?",
    type: "list",
    choices: depArray
  }
];

const deleteRoleQs = [
  {
    name: "role",
    message: "Which role do you want to delete?",
    type: "list",
    choices: roleArray
  }
];

const deleteEmployeeQs = [
  {
    name: "employee",
    message: "Which employee do you want to delete?",
    type: "list",
    choices: empArray
  }
];

// Main Menu function
function menu() {
  inquirer
    .prompt(menuOptions)
    .then(response => {
      if (response.menu === "View All Employees") {
        viewAllEmployees();
      } else if (response.menu === "View Employees By Manager") {
        viewEmployeesByManager();
      } else if (response.menu === "View Employees By Department") {
        viewEmployeesByDepartment();
      } else if (response.menu === "Add Employee") {
        addEmployee();
      } else if (response.menu === "Update Employee Role") {
        updateEmployeeRole();
      } else if (response.menu === "Update Employee Manager") {
        updateEmployeeManager();
      } else if (response.menu === "Delete Employee") {
        deleteEmployee();
      } else if (response.menu === "View All Roles") {
        viewAllRoles();
      } else if (response.menu === "Add Role") {
        addRole();
      } else if (response.menu === "Delete Role") {
        deleteRole();
      } else if (response.menu === "View All Departments") {
        viewAllDepartments();
      } else if (response.menu === "View Total Utilized Budget of Department") {
        viewDepartmentBudget();
      } else if (response.menu === "Add Department") {
        addDepartment();
      } else if (response.menu === "Delete Department") {
        deleteDepartment();
      } else if (response.menu === "Quit") {
        quit();
      }
    })
};

// Executes mysql query for employee table, logs results to a table
function viewAllEmployees() {
  const employees = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id"
  db.promise().query(employees)
    .then(([rows,fields]) => {
      console.table(rows);
    })
    .then(() => menu());
};

// Executes inquirer prompt, runs mysql query for employee table filtered by chosen manager, logs results to a table
function viewEmployeesByManager() {
  inquirer
    .prompt(viewEmployeesByManagerQs)
    .then(response => {
      const employeeManager = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id WHERE employee.manager_id = ?"
      db.promise().query(employeeManager, [response.manager])
      .then(([rows,fields]) => {
        console.table(rows);
      })
      .then(() => menu());
    })
};

function viewEmployeesByDepartment() {
  inquirer
    .prompt(viewEmployeesByDepartmentQs)
    .then(response => {
      const employeeDepartment = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id WHERE role.department_id = ?"
      db.promise().query(employeeDepartment, [response.department])
      .then(([rows,fields]) => {
        console.table(rows);
      })
      .then(() => menu());
    })
};

// Executes inquirer prompt, runs mysql query to add a new employee to the employee table with responses
function addEmployee() {
  inquirer
    .prompt(addEmployeeQs)
    .then(response => {
      const employee = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)"
      db.promise().query(employee, [response.firstName, response.lastName, response.role, response.manager])
      .then(console.info("Added " + response.firstName + " " + response.lastName + " to the database"));
    })
    .then(() => getEmployeeNames()) // Updates empNoneArray with the new employee
    .then(() => menu());
};

// Executes inquirer prompt, runs mysql query to update employee's role with responses
function updateEmployeeRole() {
  inquirer
    .prompt(updateEmployeeRoleQs)
    .then(response => {
      const employeeRole = "UPDATE employee SET role_id = ? WHERE id = ?"
      db.promise().query(employeeRole, [response.role, response.employee])
      .then(console.info("Updated employee's role"));
    })
    .then(() => menu());
};

// Executes inquirer prompt, runs mysql query to update employee's manager with responses
function updateEmployeeManager() {
  inquirer
    .prompt(updateEmployeeManagerQs)
    .then(response => {
      const employeeManager = "UPDATE employee SET manager_id = ? WHERE id = ?"
      db.promise().query(employeeManager, [response.manager, response.employee])
      .then(console.info("Updated employee's manager"));
    })
    .then(() => menu());
};

function deleteEmployee() {
  inquirer
    .prompt(deleteEmployeeQs)
    .then(response => {
      const employee = "DELETE FROM employee WHERE id = ?"
      db.promise().query(employee, [response.employee])
      .then(console.info("Deleted employee from the database"));
    })
    .then(() => getEmployeeNames())
    .then(() => menu());
};

// Executes mysql query for role table, logs results to a table
function viewAllRoles() {
  const roles = "SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON department.id = role.department_id"
  db.promise().query(roles)
    .then(([rows,fields]) => {
      console.table(rows);
    })
    .then(() => menu());
};

// Executes inquirer prompt, runs mysql query to add a new role to the role table with responses
function addRole() {
  inquirer
    .prompt(addRoleQs)
    .then(response => {
      const role = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)"
      db.promise().query(role, [response.role, response.salary, response.department])
      .then(console.info("Added " + response.role + " to the database"));
    })
    .then(() => getRoleNames()) // Updates roleArray with the new role
    .then(() => menu());
};

function deleteRole() {
  inquirer
    .prompt(deleteRoleQs)
    .then(response => {
      const role = "DELETE FROM role WHERE id = ?"
      db.promise().query(role, [response.role])
      .then(console.info("Deleted role from the database"));
    })
    .then(() => getRoleNames())
    .then(() => menu());
};

// Executes mysql query for department table, logs results to a table
function viewAllDepartments() {
  const departments = "SELECT * FROM department";
  db.promise().query(departments)
    .then(([rows,fields]) => {
      console.table(rows);
    })
    .then(() => menu());
};

function viewDepartmentBudget() {
  inquirer
  .prompt(viewDepartmentBudgetQs)
  .then(response => {
    const department = "SELECT SUM(salary) AS 'Total Utilized Budget' FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id WHERE role.department_id = ?"
    db.promise().query(department, response.department)
    .then(([rows,fields]) => {
      console.table(rows);
    })
    .then(() => menu());
  })
};

// Executes inquirer prompt, then mysql query to add a new department to the department table with responses
function addDepartment() {
  inquirer
    .prompt(addDepartmentQs)
    .then(response => {
      const department = "INSERT INTO department (name) VALUES (?)"
      db.promise().query(department, response.department)
      .then(console.info("Added " + response.department + " to the database"));
    })
    .then(() => getDepartmentNames()) // Updates depArray with the new department
    .then(() => menu());
};

function deleteDepartment() {
  inquirer
    .prompt(deleteDepartmentQs)
    .then(response => {
      const department = "DELETE FROM department WHERE id = ?"
      db.promise().query(department, [response.department])
      .then(console.info("Deleted department from the database"));
    })
    .then(() => getDepartmentNames())
    .then(() => menu());
};

// The next three functions use mysql queries to fill global arrays with department, role, and employee names for inquirer prompt choices.
function getDepartmentNames() {
  depArray.length = 0; // Arrays are emptied first to prevent duplicates
  const departments = "SELECT * FROM department"
  db.promise().query(departments)
    .then(([rows,fields]) => {
      for (let i = 0; i < rows.length; i++) {
        depArray.push({name: rows[i].name, value: rows[i].id});
      }
    })
};

function getRoleNames() {
  roleArray.length = 0;
  const roles = "SELECT * FROM role"
  db.promise().query(roles)
    .then(([rows,fields]) => {
      for (let i = 0; i < rows.length; i++) {
        roleArray.push({name: rows[i].title, value: rows[i].id});
      }
    })
};

// addEmployee() and updateEmployeeRole() need employee names, but addEmployee() also needs a "None" option for picking a manager, so they get separate arrays.
function getEmployeeNames() {
  empNoneArray.length = 0;
  empArray.length = 0;
  const employees = "SELECT * FROM employee"
  db.promise().query(employees)
    .then(([rows,fields]) => {
      for (let i = 0; i < rows.length; i++) {
        empNoneArray.push({name: rows[i].first_name + " " + rows[i].last_name, value: rows[i].id});
        empArray.push({name: rows[i].first_name + " " + rows[i].last_name, value: rows[i].id});
      }
      empNoneArray.push({name: "None", value: null})
    })
};

// Exits the application
function quit() {
  console.info("Goodbye!");
  process.exit();
};

function welcomeText() {
  console.info(`
  ????????????????????????????????????
  ????????????????????????????????????
  ??????????????????????????????????????????????????????????????????????????????
  ??????????????????????????????????????????????????????????????????????????????
  ??????????????????????????????????????????????????????????????????????????????
  ??????????????????????????????????????????????????????????????????????????????
  ?????????????????????????????????????????????????????????
  ?????????????????????????????????????????????????????????
  ??????????????????
  ??????????????????
  ?????????????????????????????????????????????????????????????????????
  ?????????????????????????????????????????????????????????????????????
  ??????????????????????????????????????????????????????????????????
  ??????????????????????????????????????????????????????????????????
  ??????????????????????????????????????????????????????
  ??????????????????????????????????????????????????????`)
};

// Fills the arrays for inquirer choices, then runs the main menu
getEmployeeNames();
getRoleNames();
getDepartmentNames();
welcomeText();
menu();