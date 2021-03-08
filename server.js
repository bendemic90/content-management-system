const mysql = require('mysql');
const inquirer = require('inquirer');
const express = require('express');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',

  port: 3306,

  user: 'root',

  // pw stored in env variable
  password: process.env.DB_PASS,
  database: 'cms_db',
});


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\non port: ${PORT}`);
    startSearch();
  });

const startSearch = () => {
    inquirer
      .prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all employees',
          'View all roles',
          'View all departments',
          'Add an employee',
          'Add a new role',
          'Add a new department',
          'Update an employees role',
          'Exit',
        ],
      })
      .then((answer) => {
        switch (answer.action) {
          case 'View all employees':
            employeeSearch();
            break;
  
          case 'View all roles':
            roleSearch();
            break;
  
          case 'View all departments':
            depSearch();
            break;
  
          case 'Add an employee':
            addEmployee();
            break;
  
          case 'Add a new role':
            addRole();
            break;

          case 'Add a new department':
            addDepartment();
            break;

          case 'Update an employees role':
            updateRole();
            break;

          case 'Exit':
            connection.end();
            break;

          default:
            console.log(`Invalid action: ${answer.action}`);
            break;
        }
      });
  };

employeeSearch = () => {
    const query = `SELECT * FROM employee`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res)
        console.log(`--------------`)
    })
    startSearch()
}

roleSearch = () => {
    const query = `SELECT * FROM role`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res)
        console.log(`--------------`)
    })
    startSearch()
}

depSearch = () => {
    const query = `SELECT * FROM department`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res)
        console.log(`--------------`)
    })
    startSearch()
}

addEmployee = () => {
    inquirer.prompt([
        {
        name: 'firstname',
        type: 'input',
        message: 'What is the employees first name?',
        },
        {
        name: 'surname',
        type: 'input',
        message: 'What is the employees surname?'
        },
    ]).then((answers) => {
        const query = 'INSERT INTO employee (first_name, last_name) VALUES (?, ?)'
        connection.query(query, [answers.firstname, answers.surname], (err, res) => {
            if (err) throw err;
            console.log(`Added employee ${answers.firstname} ${answers.surname}.`)

            startSearch()
        })
    })
    
}

addRole = () => {

}

addDepartment = () => {

}

updateRole = () => {

}

