const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['RUB', 'USD', 'EUR'], required: true },
  fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cashier', required: true },
  comment: String,
  executedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema); 