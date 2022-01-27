const { uploader } = require('cloudinary').v2;
const streamifier = require('streamifier');

const imageUpload = buffer =>
  new Promise((resolve, reject) => {
    const stream = uploader.upload_stream((error, result) => {
      if (error) reject(error);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });

module.exports = imageUpload;
