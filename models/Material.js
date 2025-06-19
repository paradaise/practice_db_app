const mongoose = require('mongoose');
const MaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  unit: String
});
module.exports = mongoose.model('Material', MaterialSchema); 