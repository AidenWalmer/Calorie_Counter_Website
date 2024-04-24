const express = require("express");
const multer = require("multer");

const fs = require('fs');
const path = require('path');

const port = 8080;

const app = express();

// Indicates that all static files are in the static folder
app.use(express.static('public'));

// Deletes all images from the Uploads directory on start up
app.get('/clear-uploads', (req, res) => {
  fs.readdir('uploads', (err, files) => {
      if (err) throw err;

      for (const file of files) {
          fs.unlink(path.join('uploads', file), err => {
              if (err) throw err;
          });
      }
  });

  res.send('Uploads cleared');
});

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


// // Instantaneous Training!!!
// const { spawn } = require('child_process');

// app.post('/profile-upload-single', upload.single('cameraFileInput'), function (req, res, next) {
//   console.log(JSON.stringify(req.file));

//   // Spawn a new python process and run the CNN_uploaded_image.py script
//   const python = spawn('python', ['./public/CNN_uploaded_image.py', req.file.path]);

//   // Collect data from the script
//   let scriptOutput = '';
//   python.stdout.on('data', (data) => {
//     scriptOutput += data.toString();
//   });

//   // Handle any errors from the script
//   python.stderr.on('data', (data) => {
//     console.error(`Python error: ${data}`);
//   });

//   // Respond to the client when the script finishes
//   python.on('close', (code) => {
//     console.log(`Python script finished with code ${code}`);
//     res.status(200).json({
//       image_url: req.file.path,
//       script_output: scriptOutput,
//     });
//   });
// });

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




