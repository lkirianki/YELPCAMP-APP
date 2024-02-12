const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name:process.env.cloudinary_cloud_name,
    api_key:process.env.cloudinary_api_key,
    api_secret:process.env.cloudinary_api_secret
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
    folder: 'yelpcamp',
    allowedformats: ['jpegs', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}
