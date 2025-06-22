const mongoose = require('mongoose');

const CashierSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  position: String,
  branch: String // Отделение банка
});

module.exports = mongoose.model('Cashier', CashierSchema); 