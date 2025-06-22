const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

router.get('/', async (req, res) => {
  const items = await Account.find().populate('clientId');
  res.json(items);
});

router.post('/', async (req, res) => {
  const item = new Account(req.body);
  await item.save();
  res.status(201).json(item);
});

router.get('/:id', async (req, res) => {
  const item = await Account.findById(req.params.id).populate('clientId');
  res.json(item);
});

router.put('/:id', async (req, res) => {
  const item = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  await Account.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router; 