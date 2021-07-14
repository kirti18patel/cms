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

userChoice();