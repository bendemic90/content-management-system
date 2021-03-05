
const express = require('express');
const fs = require('fs');
const inquirer = require('inquirer');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.listen(PORT, () => console.log(`listening to port ${PORT}`));