const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Título é obrigatório'] 
  },
  description: { 
    type: String, 
    required: [true, 'Descrição é obrigatória'] 
  },
  price: { 
    type: Number, 
    required: [true, 'Preço é obrigatório'] 
  },
  category: { 
    type: String, 
    required: [true, 'Categoria é obrigatória'],
    enum: ['vendas', 'servicos', 'imoveis', 'empregos', 'veiculos', 'eletronicos']
  },
  location: { 
    type: String, 
    required: [true, 'Localização é obrigatória'] 
  },
  images: [String],
  featured: { 
    type: Boolean, 
    default: false 
  },
  featuredUntil: Date,
  views: { 
    type: Number, 
    default: 0 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'pending'], 
    default: 'active' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Ad', AdSchema);