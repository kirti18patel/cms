const db = require('./connection');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

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
    let sqlQuery = `SELECT * FROM employee`;
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
    let sqlQuery = `SELECT * FROM role`;
    db.query(sqlQuery, function(err, result, fields) {
        if (err) throw err;
        console.log("\n=============================================================================================================================\n");
        console.table(result);
        userChoice();
    })   
}

const addEmployee = () =>{
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
            name: 'roleId',
            type: 'input',
            message: "Enter role id of employee : " 
        },
        {
            name: 'managerId',
            type: 'input',
            message: "Enter manager id of employee's manager : " 
        }
    ]).then(answers => {
        let sqlQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, ?, ?)`;
        let data = [answers.firstName, answers.lastName, answers.roleId, answers.managerId];

        db.query(sqlQuery, data, function(err, result, fields) 
        {
            if (err) throw err;
            console.log("\n=============================================================================================================================\n");
            console.log("Employee added to Employee Table");
            userChoice();
        })
    })
}


userChoice();