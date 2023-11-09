const express = require("express");
const multer = require("multer");
const port = 8080;

const app = express();

// Indicates that all static files are in the static folder
app.use(express.static('static'));

app.use(express.urlencoded({extended: true}));  // for application/x-www-form-urlencoded
app.use(express.json());    // for applcation/json
app.use(multer().none());   // for multipart/form-data (required with from data)

app.listen(port,() => console.log('Server running on port ${port}!'));