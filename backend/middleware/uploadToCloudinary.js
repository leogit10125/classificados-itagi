const { Readable } = require('stream');
const {
  cloudinary,
  cloudinaryConfigurado
} = require('../config/cloudinary');

function enviarImagem(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'itagi-classificados',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}

module.exports = async function uploadToCloudinary(req, res, next) {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  if (!cloudinaryConfigurado) {
    return res.status(503).json({
      error: 'O armazenamento de imagens ainda não está configurado.'
    });
  }

  try {
    const resultados = await Promise.all(
      req.files.map(file => enviarImagem(file.buffer))
    );

    req.files = req.files.map((file, index) => ({
      ...file,
      filename: resultados[index].secure_url,
      path: resultados[index].secure_url,
      cloudinaryPublicId: resultados[index].public_id
    }));

    next();
  } catch (error) {
    console.error('Falha ao enviar imagens ao Cloudinary:', error.message);

    return res.status(502).json({
      error: 'Não foi possível armazenar as imagens. Tente novamente.'
    });
  }
};
