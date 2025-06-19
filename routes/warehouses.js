const express = require('express');
const router = express.Router();
const Warehouse = require('../models/Warehouse');

// GET all warehouses
router.get('/', async (req, res) => {
  const warehouses = await Warehouse.find();
  res.json(warehouses);
});

// GET warehouse by id
router.get('/:id', async (req, res) => {
  const warehouse = await Warehouse.findById(req.params.id);
  if (!warehouse) return res.status(404).json({ error: 'Not found' });
  res.json(warehouse);
});

// POST create warehouse
router.post('/', async (req, res) => {
  const warehouse = new Warehouse(req.body);
  await warehouse.save();
  res.status(201).json(warehouse);
});

// PUT update warehouse
router.put('/:id', async (req, res) => {
  const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!warehouse) return res.status(404).json({ error: 'Not found' });
  res.json(warehouse);
});

// DELETE warehouse
router.delete('/:id', async (req, res) => {
  const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
  if (!warehouse) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router; 