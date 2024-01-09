require('dotenv').config()

const cloudinary = require("cloudinary").v2;

// import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDNIARY_APIKEY, 
  api_secret: process.env.CLOUDINARY_APISECRET 
});

// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

module.exports = cloudinary 