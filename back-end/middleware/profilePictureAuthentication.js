const multer = require("multer");
const path = require("path");

const storageConfig = multer.diskStorage({
  destination: "./public/assets",
  filename: function (request, uploadedFile, callback) {
    callback(
      null,
      Date.now() + "-" + uploadedFile.originalname 
    );
  },
});

const profilepictureauthenticate = multer({
  storage: storageConfig,
  // limits: { fileSize: 1000000 }, 
  fileFilter: function (request, uploadedFile, callback) {
    checkFileType(uploadedFile, callback);
  },
}).single("profilePicture");



function checkFileType(uploadedFile, callback) {

  const allowedFileTypes = /jpeg|jpg|png/;
  
  const extensionName = allowedFileTypes.test(path.extname(uploadedFile.originalname).toLowerCase());
 
  const mimeType = allowedFileTypes.test(uploadedFile.mimetype);

  if (mimeType && extensionName) {
    return callback(null, true);
  } else {
    callback("Error: Images only!");
  }
}

module.exports = profilepictureauthenticate;