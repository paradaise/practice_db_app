const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: String,
  passportSeries: { type: String, required: true },
  passportNumber: { type: String, required: true },
  tin: { type: String, unique: true }, // ИНН
  type: { type: String, enum: ['individual', 'legal'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', ClientSchema); 