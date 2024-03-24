const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "employee_db"
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting to database:", err);
        return;
    }
    runApp();
});

function runApp() {
    inquirer.prompt({
        name: "startQuestions",
        type: "list",
        message: "what would you like to do?",
        choices: ["view all departments", "add department", "delete department", "view all roles", "add role", "delete role", "view all employees", "add employee", "update an employee role", "delete employee", "view employees by department", "update an employee manager", "view department budget", "quit"]
    }).then(function (answer) {
        switch (answer.startQuestions) {
            case "view all departments":
                viewAllDepartments();
                break;
            case "add department":
                addDepartment();
                break;
            case "delete department":
                deleteDepartment();
                break;
            case "view all roles":
                viewAllRoles();
                break;
            case "add role":
                addRole();
                break;
            case "delete role":
                deleteRole();
                break;
            case "view all employees":
                viewAllEmployees();
                break;
            case "add employee":
                addEmployee();
                break;
            case "update an employee role":
                updateEmployeeRole();
                break;
            case "delete employee":
                deleteEmployee();
                break;
            case "view employees by department":
                viewEmployeesByDepartment();
                break;
            case "update an employee manager":
                updateEmployeeManager();
                break;
            case "view department budget":
                viewDepartmentBudget();
                break;
            case "quit":
                connection.end();
                break;
        }
    });
}

function viewAllDepartments() {
    connection.query("SELECT * FROM department", function (err, data) {
        if (err) {
            console.error("Error retrieving departments data:", err);
            return;
        }
        console.table(data);
        runApp();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What is the department name?"
        }
    ]).then(function (res) {
        connection.query("INSERT INTO department (name) VALUES (?)", [res.department], function (err, data) {
            if (err) {
                console.error("Error adding department:", err);
                return;
            }
            console.log("Added Department");
            runApp();
        });
    });
}

function viewAllRoles() {
    connection.query("SELECT * FROM role", function (err, data) {
        if (err) {
            console.error("Error retrieving roles data:", err);
            return;
        }
        console.table(data);
        runApp();
    });
}

function addRole() {
    inquirer.prompt([
        {
            message: "Enter role title:",
            type: "input",
            name: "title"
        },
        {
            message: "Enter salary:",
            type: "number",
            name: "salary"
        },
        {
            message: "Enter department ID:",
            type: "number",
            name: "department_id"
        }
    ]).then(function (res) {
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [res.title, res.salary, res.department_id], function (err, data) {
            if (err) {
                console.error("Error adding role:", err);
                return;
            }
            console.log("Added Role");
            runApp();
        });
    });
}

function viewAllEmployees() {
    const query = `
        SELECT 
            e.id AS id,
            e.first_name AS first_name,
            e.last_name AS last_name,
            r.title AS title,
            d.name AS department,
            r.salary AS salary,
            CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM 
            employee e
        INNER JOIN 
            role r ON e.role_id = r.id
        INNER JOIN 
            department d ON r.department_id = d.id
        LEFT JOIN 
            employee m ON e.manager_id = m.id`;

    connection.query(query, function (err, data) {
        if (err) {
            console.error("Error retrieving employee data:", err);
            return;
        }
        console.table(data);
        runApp();
    });
}

function addEmployee() {
    connection.query("SELECT id, title FROM role", function (err, roles) {
        if (err) {
            console.error("Error retrieving role data:", err);
            return;
        }

        connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employee WHERE manager_id IS NULL", function (err, managers) {
            if (err) {
                console.error("Error retrieving manager data:", err);
                return;
            }

            inquirer.prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the employee's last name?"
                },
                {
                    type: "list",
                    name: "roleId",
                    message: "Select the employee's role:",
                    choices: roles.map(role => ({ name: role.title, value: role.id }))
                },
                {
                    type: "list",
                    name: "managerId",
                    message: "Select the employee's manager:",
                    choices: managers.map(manager => ({ name: manager.manager_name, value: manager.id }))
                }
            ]).then(function (res) {
                connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [res.firstName, res.lastName, res.roleId, res.managerId], function (err, data) {
                    if (err) {
                        console.error("Error adding employee:", err);
                        return;
                    }
                    console.log("Added Employee");
                    runApp();
                });
            });
        });
    });
}

function updateEmployeeRole() {
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS full_name FROM employee WHERE manager_id IS NOT NULL", function (err, employees) {
        if (err) {
            console.error("Error retrieving employee data:", err);
            return;
        }

        connection.query("SELECT id, title FROM role", function (err, roles) {
            if (err) {
                console.error("Error retrieving role data:", err);
                return;
            }

            inquirer.prompt([
                {
                    message: "Which employee's role do you want to update?",
                    type: "list",
                    name: "employeeId",
                    choices: employees.map(emp => ({ name: emp.full_name, value: emp.id }))
                },
                {
                    message: "Select the new role:",
                    type: "list",
                    name: "role_id",
                    choices: roles.map(role => ({ name: role.title, value: role.id }))
                }
            ]).then(function (res) {
                connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [res.role_id, res.employeeId], function (err, data) {
                    if (err) {
                        console.error("Error updating employee role:", err);
                        return;
                    }
                    console.log("Updated Employee Role");
                    runApp();
                });
            });
        });
    });
}