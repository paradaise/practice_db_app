const express = require('express');
const router = express.Router();
const Cashier = require('../models/Cashier');

router.get('/', async (req, res) => {
  const items = await Cashier.find();
  res.json(items);
});

router.post('/', async (req, res) => {
  const item = new Cashier(req.body);
  await item.save();
  res.status(201).json(item);
});

router.get('/:id', async (req, res) => {
  const item = await Cashier.findById(req.params.id);
  res.json(item);
});

router.put('/:id', async (req, res) => {
  const item = await Cashier.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  await Cashier.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router; 