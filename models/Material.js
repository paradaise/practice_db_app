const mongoose = require('mongoose');
const MaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  unit: String,
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  manufacturer: String
});
module.exports = mongoose.model('Material', MaterialSchema); 