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
