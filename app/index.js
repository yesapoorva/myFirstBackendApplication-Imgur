require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const ImageModel = require('./image.model');
// const ImageSchema = require('./image.model');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../cloudinary/cloudinary');

const app = express();

const PORT = 3009;

const MONGO_URL = 'mongodb://127.0.0.1:27017/imgurdb';

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

const Storage = multer.diskStorage({
    destination: 'uploads', 
    filename: (req,file,cb) => {
        cb(null,file.fieldname + "_" +Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: Storage
}).single('file'); 

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true , limit: '50mb'}))
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('uploads'))

// app.get('/getImage', (req,res) => {
//     console.log(`GET all images`);
//     // ImageModel.find().then((images) => res.send(images)).catch((error) => res.status(500).send(error));
//   const imagePath = 'uploads/image5.jpeg';
//   const imageBuffer = fs.readFileSync(imagePath);

//   // Convert the image buffer to a base64-encoded string
//   const base64Image = imageBuffer.toString('base64');

//   // Send the image data and metadata in the response
//   res.json({
//     metadata: {
//       fieldname: 'file',
//       originalname: 'image3.jpeg',
//       encoding: '7bit',
//       mimetype: 'image/jpeg',
//       destination: 'uploads',
//       filename: 'file_1696995134586.jpeg',
//       path: imagePath,
//       size: imageBuffer.length,
//     },
//     image: base64Image,
//   });
// });

app.get('/getImage', (req, res) => {
    ImageModel.find()
      .then(images => {
        const imagePromises = images.map(image => {
          const imageBuffer = image.image.data.buffer; 
          const base64Image = imageBuffer.toString('base64');
  
          return {
            metadata: {
              fieldname: 'file',
              originalname: image.originalname,
              encoding: '7bit',
              mimetype: image.image.contentType, 
            },
            image: base64Image,
          };
        });
  
        return Promise.all(imagePromises);
      })
      .then(allImages => {
        res.json(allImages);
      })
      .catch(error => {
        console.error('Error fetching and processing images:', error);
        res.status(500).send(error);
      });
  });

  
app.get('/images/:id', (req, res) => {
   console.log(`GET a specific image with ID`);
   const imageId = req.params.id;
   ImageModel.findById(imageId).then((image) => res.send(image)).catch((error) => res.status(500).send(error));
});

// app.post('/upload', (req, res) => {
//     console.log(`create a specific image`);
//     // const image = new Image(req.body);
//     // image.save().then((savedImage) => res.json(savedImage)).catch((error) => res.status(500).send(error));
//     upload(req,res,(err) => {
//         if(err){
//             console.log(err);
//         }
//         else{
//             const newImage = new ImageModel({
//                 // name: req.body.name,
//                 image: {
//                     data: req.file.filename,
//                     contentType: 'image/jpeg'
//                 }
                
//             })
//             console.log(req.file);
//             newImage.save().then(() => res.send('uploaded succefully')).catch((e) => console.log(e));
//         }
//     })
// });

app.post('/upload', async (req, res) => {
    const {image} = req.body ;
    const uploadedImage= await cloudinary.uploader.upload(image,
    {
        upload_preset: 'unsigned_upload',
    
        allowed_formats: ['png','jpg','jpeg','svg','ico','jfif', 'webp']

    }, 
    function(error, result) {
        if(error){
            console.log(error)
        }
        console.log(result); });
    // res.status(200).json(result)
    try {
        res.status(200).json(uploadedImage)
    }catch(err){
        console.log(err)
    }
})


app.delete('/images/:id', (req, res) => {
    console.log(`delete a specific image`);
    const n = req.params.id;

    ImageModel.deleteOne({ name: n }).then(function() {
        console.log("Data deleted");
        res.send("Image deleted successfully");
    }).catch(function(error) {
        console.log(error);
        res.status(500).send("Error deleting image"); 
    });
});

// app.put('/images/:id', upload, (req, res) => {
//     console.log('update a specific image');
//     const id = req.params.id;
//     const updatedImage = req.file; //object

//     ImageModel.findByIdAndUpdate(id, { image: updatedImage.filename })
//       .then(() => {
//         console.log('Image updated');
//         res.send('Image updated successfully'); 
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(500).send('Error updating image'); 
//       });
//   });
  
app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
});