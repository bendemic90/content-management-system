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
          'View employees joined with role table',
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

          case 'View employees joined with role table':
            viewEmpRole();
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

viewEmpRole = () => {
  const query = `SELECT * FROM employee INNER JOIN role ON role.id = employee.role_id`
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res)
  })
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
    const query = 'SELECT * FROM employee'
    connection.query(query, (err, res) => {
    const eList = [];
    const otherList = [];
    for (i = 0; i < res.length; i++) {
      const empObj = {
      id: res[i].id,
      first_name: res[i].first_name,
      last_name: res[i].last_name,
      }
      otherList.push(empObj);
      eList.push(res[i].first_name + ' ' + res[i].last_name);
    }
      if (err) throw err;
      inquirer.prompt([
        {
          type: 'list',
          name: 'empChoice',
          choices: eList,
          message: 'Which employee will you update?'
        }
      ]).then((answers) => {
        const query2 = `select * from role`
        connection.query(query2, (err, res2) => {
        const roles = [];
          for (j = 0; j < res2.length; j++) {
          roles.push(res2[j].title)
          }
          if (err) throw err;
        
          inquirer.prompt([
            {
              message: `To what role will you assign ${answers.empChoice}?`,
              choices: roles,
              type: 'list',
              name: 'roleChoice',
            }
          ]).then((newRole) => {
            
            const g = () => {
              for (k = 0; k < res2.length; k++) {
                if (newRole.roleChoice === res2[k].title) {
                  return res2[k].id;
                }
              }
            }
            
            const h = () => {
              for (p = 0; p < otherList.length; p++) {
                if (answers.empChoice == (otherList[p].first_name + ' ' + otherList[p].last_name)) {
                  return otherList[p].id;
                }
              }
            }
            const query3 = `UPDATE employee SET role_id=? WHERE id=?`;
            connection.query(query3, [g(), h()], (err, res) => {
              console.log(`EMPLOYEE UPDATED. GOING BACK TO MENU`)
              startSearch();
            })
          })
        })
      })
    })
  }