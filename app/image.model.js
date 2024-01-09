const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        data: Buffer, 
        contentType: String
    },
    path: String,
});

module.exports = ImageModel = mongoose.model('imageModel', ImageSchema);