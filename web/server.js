const express = require("express");
const multer = require("multer");

const fs = require('fs');
const path = require('path');

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

// Places the uploaded file into the 'uploads' folder
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

// Uploads a single image from the cameraFileInput on the client side
app.post('/profile-upload-single', upload.single('cameraFileInput'), function (req, res, next) {
  console.log(JSON.stringify(req.file))
  return res.status(200).json({
    image_url: req.file.path
  });
})

// Previous Photos Button: Displays images in the uploads directory in order of recency (most -> least)
app.get('/get-images', function(req, res) {
  const uploadsDirectory = path.join(__dirname, 'uploads');
  fs.readdir(uploadsDirectory, function(err, files) {
      if (err) {
          console.log(err);
          res.status(500).send('Error reading uploads directory');
      } else {
          const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png')); // adjust as needed
          Promise.all(imageFiles.map(file => {
              return new Promise((resolve, reject) => {
                  fs.stat(path.join(uploadsDirectory, file), (err, stats) => {
                      if (err) {
                          reject(err);
                      } else {
                          resolve({file, mtime: stats.mtime});
                      }
                  });
              });
          }))
          .then(files => {
              files.sort((a, b) => b.mtime - a.mtime);
              res.send(files.map(file => file.file));
          })
          .catch(err => {
              console.log(err);
              res.status(500).send('Error reading file stats');
          });
      }
  });
});

app.use(express.urlencoded({extended: true}));  // for application/x-www-form-urlencoded
app.use(express.json());    // for applcation/json
app.use(multer().none());   // for multipart/form-data (required with from data)

// Displays which port the server is running on 
app.listen(port,() => console.log("Server running on port " + port + "!")); 




