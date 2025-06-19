const mongoose = require('mongoose');
const StockSchema = new mongoose.Schema({
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  quantity: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Stock', StockSchema); 