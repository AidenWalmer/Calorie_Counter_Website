const express = require("express");
const multer = require("multer");
const port = 8080;

const app = express();

// Indicates that all static files are in the static folder
app.use(express.static('public'));

// Use multer to allow image to be placed in file
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.post('/profile-upload-single', upload.single('cameraFileInput'), function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  console.log(JSON.stringify(req.file))
  // var response = '<a href="/">Home</a><br>'
  // response += "Files uploaded successfully.<br>"
  // response += `<img src="${req.file.path}" /><br>`
  // return res.send(response)

  return res.status(200).json({
    image_url: req.file.path
  });
})

app.use(express.urlencoded({extended: true}));  // for application/x-www-form-urlencoded
app.use(express.json());    // for applcation/json
app.use(multer().none());   // for multipart/form-data (required with from data)

// Display which port the server is running on 
app.listen(port,() => console.log("Server running on port " + port + "!")); 




