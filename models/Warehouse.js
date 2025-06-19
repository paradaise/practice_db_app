const mongoose = require('mongoose');
const WarehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  email: String,
  manager: String
});
module.exports = mongoose.model('Warehouse', WarehouseSchema); 