-- View All Roles table
SELECT role.id, role.title, role.salary, department.name AS department
FROM role 
JOIN department ON department.id = role.department_id;

-- View All Employees table
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;