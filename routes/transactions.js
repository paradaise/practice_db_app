const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  const items = await Transaction.find().populate('fromAccount toAccount cashierId');
  res.json(items);
});

router.post('/', async (req, res) => {
  // В реальном приложении здесь должна быть сложная логика
  // по проверке баланса и обновлению счетов
  const item = new Transaction(req.body);
  await item.save();
  res.status(201).json(item);
});

router.get('/:id', async (req, res) => {
  const item = await Transaction.findById(req.params.id).populate('fromAccount toAccount cashierId');
  res.json(item);
});

module.exports = router; 