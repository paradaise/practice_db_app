const express = require('express');
const router = express.Router();
const Movement = require('../models/Movement');

// GET all movements
router.get('/', async (req, res) => {
  const movements = await Movement.find().populate('material fromWarehouse toWarehouse');
  res.json(movements);
});

// GET movement by id
router.get('/:id', async (req, res) => {
  const movement = await Movement.findById(req.params.id).populate('material fromWarehouse toWarehouse');
  if (!movement) return res.status(404).json({ error: 'Not found' });
  res.json(movement);
});

// POST create movement
router.post('/', async (req, res) => {
  const movement = new Movement(req.body);
  await movement.save();
  res.status(201).json(movement);
});

// PUT update movement
router.put('/:id', async (req, res) => {
  const movement = await Movement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!movement) return res.status(404).json({ error: 'Not found' });
  res.json(movement);
});

// DELETE movement
router.delete('/:id', async (req, res) => {
  const movement = await Movement.findByIdAndDelete(req.params.id);
  if (!movement) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router; 