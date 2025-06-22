const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

router.get('/', async (req, res) => {
  const items = await Client.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  const item = new Client(req.body);
  await item.save();
  res.status(201).json(item);
});

router.get('/:id', async (req, res) => {
  const item = await Client.findById(req.params.id);
  res.json(item);
});

router.put('/:id', async (req, res) => {
  const item = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router; 