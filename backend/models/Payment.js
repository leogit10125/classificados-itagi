const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  ad: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ad' 
  },
  plan: { 
    type: String, 
    enum: ['destaque', 'super', 'mensal'] 
  },
  amount: Number,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'cancelled'], 
    default: 'pending' 
  },
  paymentMethod: String,
  transactionId: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);