const mongoose = require('mongoose');
const MovementSchema = new mongoose.Schema({
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
  fromWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  toWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['in', 'out', 'move'], required: true },
  comment: String,
  operator: String
});
module.exports = mongoose.model('Movement', MovementSchema); 