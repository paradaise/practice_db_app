const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

// GET all materials
router.get('/', async (req, res) => {
  const materials = await Material.find();
  res.json(materials);
});

// GET material by id
router.get('/:id', async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ error: 'Not found' });
  res.json(material);
});

// POST create material
router.post('/', async (req, res) => {
  const material = new Material(req.body);
  await material.save();
  res.status(201).json(material);
});

// PUT update material
router.put('/:id', async (req, res) => {
  const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!material) return res.status(404).json({ error: 'Not found' });
  res.json(material);
});

// DELETE material
router.delete('/:id', async (req, res) => {
  const material = await Material.findByIdAndDelete(req.params.id);
  if (!material) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router; 