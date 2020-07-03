const express = require('express')
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();



// Route files
const register = require('./route');
const login = require('./route');
const logout = require('./route')
const hello = require('./route')
const getUser = require('./route')

// const dotenv = require('dotenv')

global.fetch = require('node-fetch');


app.use(bodyParser.json());


app.use('/api', register);
app.use('/api', login);
app.use('/api', logout);
app.use('/api', hello);
app.use('/api', getUser)


const port = 3000;
const server = app.listen(port, () => {
  console.log(`server running on port ${port}`);
})

process.on('unhandledRejection', (error,res) => {
  console.log('unhandledRejection', error.message);
  server.close(() => process.exit(1));
});

