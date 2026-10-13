const cloudinary = require('cloudinary').v2;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const cloudinaryConfigurado = Boolean(
  cloudName && apiKey && apiSecret
);

if (cloudinaryConfigurado) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
} else {
  console.warn(
    'Cloudinary ainda não configurado: faltam variáveis de ambiente.'
  );
}

module.exports = {
  cloudinary,
  cloudinaryConfigurado
};
