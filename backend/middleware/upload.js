// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garantir que a pasta uploads existe
const uploadDir = path.join(__dirname, '..', 'uploads');
console.log('📁 Caminho da pasta uploads:', uploadDir);

// Criar a pasta se não existir
if (!fs.existsSync(uploadDir)) {
  console.log('📁 Pasta uploads não existe. Criando...');
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Pasta uploads criada com sucesso!');
} else {
  console.log('✅ Pasta uploads já existe.');
  
  // Verificar permissões de escrita
  try {
    fs.accessSync(uploadDir, fs.constants.W_OK);
    console.log('✅ Pasta uploads tem permissão de escrita');
  } catch (err) {
    console.log('❌ Pasta uploads SEM permissão de escrita!');
  }
}

// Configuração do storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Destination callback - salvando em:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = 'img-' + uniqueSuffix + ext;
    
    console.log('📸 Arquivo original:', file.originalname);
    console.log('📸 Novo nome:', filename);
    console.log('📸 Extensão:', ext);
    console.log('📸 Mimetype:', file.mimetype);
    
    cb(null, filename);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  console.log('🔍 Verificando arquivo:', file.originalname);
  console.log('   Extensão válida:', extname);
  console.log('   Mimetype válido:', mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, gif, webp)'));
};

// Configuração do multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter
});

console.log('🚀 Multer configurado com sucesso!');

module.exports = upload;