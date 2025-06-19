const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');

// GET all stock
router.get('/', async (req, res) => {
  const stock = await Stock.find().populate('material warehouse');
  res.json(stock);
});

// GET stock by id
router.get('/:id', async (req, res) => {
  const stock = await Stock.findById(req.params.id).populate('material warehouse');
  if (!stock) return res.status(404).json({ error: 'Not found' });
  res.json(stock);
});

// POST create stock
router.post('/', async (req, res) => {
  const stock = new Stock(req.body);
  await stock.save();
  res.status(201).json(stock);
});

// PUT update stock
router.put('/:id', async (req, res) => {
  const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!stock) return res.status(404).json({ error: 'Not found' });
  res.json(stock);
});

// DELETE stock
router.delete('/:id', async (req, res) => {
  const stock = await Stock.findByIdAndDelete(req.params.id);
  if (!stock) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router; 