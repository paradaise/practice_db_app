const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  accountNumber: { type: String, unique: true, required: true },
  currency: { type: String, enum: ['RUB', 'USD', 'EUR'], required: true },
  balance: { type: Number, default: 0 },
  openedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'closed', 'frozen'], default: 'active' }
});

module.exports = mongoose.model('Account', AccountSchema); 