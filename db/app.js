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
                    role.salary,
                    employee.manager_id
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
                    department.name AS department,
                    role.salary
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
                        db.query(sql, empInfo, function(err, result){
                            if (err) throw err;
                            console.log("Employee has been added!");
                            viewAllEmployee();
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
            viewAllDepartments();
            userChoice();
        })
    })
}

const addRole = () =>{
    const sql = `SELECT * FROM department`;
        db.query(sql, function(err, result, fields) 
        {
            if (err) throw err;
            let departmentArray = [];
            result.forEach((department) => {departmentArray.push(department.name)});
            departmentArray.push("Create Department");

            inquirer.prompt([
                {
                    name: "deptName",
                    type: 'list',
                    message: 'In which department you want to add a new role',
                    choices: departmentArray
                }
            ]).then((answers) => {
                if(answers.deptName === "Create Department"){
                    addDepartment();
                    return;
                }
                else{
                    addRoleExistDept(answers);
                }
            });

            const addRoleExistDept = userChoiceAddRole =>{
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
                    }
                ]).then((answers) => {
                    let newRole = answers.title;
                    let departmentId;
            
                    result.forEach((department) =>{
                        if( userChoiceAddRole.deptName === department.name ){
                            departmentId = department.id;
                        }
                    })
                    console.log(departmentId);  
                    let sqlQuery = `INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, ?)`;
                    let data = [newRole, answers.salary, departmentId];
                    
                    db.query(sqlQuery, data, function(err, result, fields) 
                        {
                            if (err) throw err;
                            console.log("\n=============================================================================================================================\n");
                            console.log("Role added to Role Table");
                            viewAllRoles();
                            userChoice();
                        })
                })
            
            }

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