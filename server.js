const mysql = require('mysql');
const inquirer = require('inquirer');
const express = require('express');
//const cTable = require('console.table');
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
        message: '\nWhat would you like to do?',
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
            console.log(`\n`)
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
    const query = `SELECT * FROM employee`;
    connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n')
    console.table(res)
    })
    console.log('\n')
    return startSearch();
}


roleSearch = () => {
    const query = `SELECT * FROM role`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n')
        console.table(res)
        
    })
    console.log('\n')
    startSearch()
}

depSearch = () => {
    const query = `SELECT * FROM department`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n')
        console.table(res)
    })
    console.log('\n')
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
        })
        console.log('\n', '\n', '\n')
        startSearch();
    })
    
}

addRole = () => {
    inquirer.prompt([
        {
        name: 'role',
        type: 'input',
        message: 'What is the role you would like to add?',
        },
        {
        name: 'salary',
        type: 'input',
        message: 'What is the base salary of this position?'
        },
    ]).then((answers) => {
        const query = 'INSERT INTO role (title, salary) VALUES (?, ?)'
        connection.query(query, [answers.role, answers.salary], (err, res) => {
            if (err) throw err;
            console.log(`Added role: ${answers.role}, at base rate of $${answers.salary}.`)
        })
        startSearch()
    })
}

addDepartment = () => {
    inquirer.prompt([
        {
        name: 'department',
        type: 'input',
        message: 'What is the name of the department you wish to add?',
        },
    ]).then((answers) => {
        const query = 'INSERT INTO department (department_name) VALUES (?)'
        connection.query(query, [answers.department], (err, res) => {
            if (err) throw err;
            console.log(`Added department: ${answers.department}.`)
            console.log('\n', '\n', '\n')
            startSearch()
        })
    })
}

updateRole = () => {
    
}

