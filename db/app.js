const db = require('./connection');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const figlet = require("figlet")

console.log(figlet.textSync('Employee Tracker'));

function userChoice(){
    console.log("\n=============================================================================================================================\n");
    inquirer.prompt([
        {
            name: 'listoptions',
            type: 'list',
            message: 'Would you like to : ',
            choices: ['view all employees', 
                'view all departments', 
                'view all roles', 
                'add an employee', 
                'add a department', 
                'add a role', 
                'update employee role', 
                'delete an employee', 
                'Exit']
        }
    ]).then(answers => {
        switch(answers.listoptions){
            case 'view all employees':
                viewAllEmployee();
                break;
            case 'view all departments':
                viewAllDepartments(); 
                break;
            case 'view all roles':
                viewAllRoles(); 
                break;
            case 'add an employee':
                addEmployee(); 
                break;
            case 'add a department':
                addDepartment();
                break;
            case 'add a role':
                addRole();
                break;
            case 'update employee role':
                updateEmpoyeeRole(); 
                break;
            case 'delete an employee':
                deleteEmployee(); 
                break;
            case 'Exit':
                exit();
        }
    })
}

const viewAllEmployee = () =>{
    let sqlQuery = `SELECT employee.id,
                    employee.first_name, 
                    employee.last_name, 
                    role.title,
                    department.name AS Department,
                    role.salary
                    FROM employee, role, department
                    WHERE department.id = role.department_id
                    AND role.id = employee.role_id
                    ORDER BY employee.id ASC`;

    db.query(sqlQuery, function(err, result, fields) 
    {
        if (err) throw err;
        console.log("\n=============================================================================================================================\n");
        console.table(result);
    }) 
    userChoice();
}

const viewAllDepartments = () =>{
    let sqlQuery = `SELECT * FROM department`;
    db.query(sqlQuery, function(err, result, fields) {
        if (err) throw err;
        console.log("\n=============================================================================================================================\n");
        console.table(result);
        userChoice();
    })  
}

const viewAllRoles = () =>{
    let sqlQuery = `SELECT role.id,
                    role.title,
                    department.name AS department
                    FROM role INNER JOIN department ON role.department_id = department.id`;

    db.query(sqlQuery, function(err, result, fields) {
        if (err) throw err;
        console.log("\n=============================================================================================================================\n");
        console.table(result);
        userChoice();
    })   
}

const addEmployee = () =>
{
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: "Enter First name of employee : " 
        },
        {
            name: 'lastName',
            type: 'input',
            message: "Enter Last name of employee : " 
        },
        {
            name: 'managerId',
            type: 'input',
            message: "Enter manager id of employee's manager : " 
        }
    ]).then(answers => {
        const empInfo = [answers.firstName, answers.lastName];
        const roleSqlQuery = `SELECT role.id, role.title FROM role`;
        db.query(roleSqlQuery, function(err, result, fields) 
        {
            if (err) throw err;
            const roles = result.map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "Enter role id of employee : ",
                    choices: roles
                }
            ]).then(roleChoice => {
                const role = roleChoice.role;
                empInfo.push(role);
                const managerSql = `Select * FROM employee`;
                db.query(managerSql, function(err, managerData, fields) 
                {
                    if (err) throw err;
                    const managers = managerData.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                    inquirer.prompt([
                        {
                          type: 'list',
                          name: 'manager',
                          message: "Who is the employee's manager?",
                          choices: managers
                        }
                    ]).then(managerChoice => {
                        const manager = managerChoice.manager;
                        empInfo.push(manager);
                        const sql =   `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                        console.log(empInfo, sql);
                        db.query(sql, empInfo, function(err, result){
                            if (error) throw error;
                            console.log("Employee has been added!")
                            userChoice();
                        })
                    })  

                })

            })
        })
    })
}

const addDepartment = () =>{
    inquirer.prompt([
        {
            name: 'departmentName',
            type: 'input',
            message: "Enter department name to be added : " 
        }
    ]).then(answers => {
        let sqlQuery = `INSERT INTO department (name)
        VALUES (?)`;
        let data = [answers.departmentName];
        
        db.query(sqlQuery, data, function(err, result, fields) 
        {
            if (err) throw err;
            console.log("\n=============================================================================================================================\n");
            console.log("Department added to department Table");
            userChoice();
        })
    })
}

const addRole = () =>{
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: "Enter title of role to be added : " 
        },
        {
            name: 'salary',
            type: 'input',
            message: "Enter salary associated with role : " 
        },
        {
            name: 'departmentId',
            type: 'input',
            message: "Enter department id of role : " 
        }
    ]).then(answers => {
        let sqlQuery = `INSERT INTO role (title, salary, department_id)
        VALUES (?, ?, ?)`;
        let data = [answers.title, answers.salary, answers.departmentId];
        
        db.query(sqlQuery, data, function(err, result, fields) 
        {
            if (err) throw err;
            console.log("\n=============================================================================================================================\n");
            console.log("Role added to Role Table");
            userChoice();
        })
    })
}

const updateEmpoyeeRole = () =>{
    console.log("update employee");
    userChoice();    
}

const exit = () =>{
    console.log("Thank You for using Employee Tracker");
}


userChoice();