const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
  const allowedTypes = /\.(jpe?g|png|gif|webp)$/i;
  const validExtension = allowedTypes.test(
    path.extname(file.originalname)
  );
  const validMime = /^image\/(jpeg|png|gif|webp)$/i.test(file.mimetype);

  if (validExtension && validMime) {
    return cb(null, true);
  }

  cb(new Error('Apenas imagens JPEG, PNG, GIF e WEBP são permitidas.'));
};

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5
  },
  fileFilter
});
