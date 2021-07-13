const mysql = require('mysql');
const db = require('./connection');
const express = require('express');
const router = express.Router();
const inquirer = require('inquirer');
const consoleTable = require('console.table');

function userChoice(){
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
            case 'view all departments':
                viewAllDepartments(); 
            case 'view all roles':
                viewAllRoles(); 
            case 'add an employee':
                addEmployee(); 
            case 'add a department':
                addDepartment();
            case 'add a role':
                addRole();
            case 'update employee role':
                updateEmpoyeeRole(); 
            case 'delete an employee':
                deleteEmployee(); 
            case 'Exit':
                exit();
        }
    })
}

const viewAllEmployee = () =>{
    console.log("view all employee");
}
const viewAllDepartments = () =>{
    console.log("view all department");
    
}
const viewAllRoles = () =>{
    console.log("view all roles");
    
}
const addEmployee = () =>{
    console.log("add employee");
    
}
const addDepartment = () =>{
    console.log("add department");
    
}
const addRole = () =>{
    console.log("add role");
    
}
const updateEmpoyeeRole = () =>{
    console.log("uepdate employee");
    
}
const deleteEmployee = () =>{
    console.log("delete employee");
    
}
const exit = () =>{
    console.log("exit");
    
}

userChoice();