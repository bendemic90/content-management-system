const mysql = require('mysql');
const express = require('express');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
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
  });