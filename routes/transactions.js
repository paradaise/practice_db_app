const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

router.get('/', async (req, res) => {
  const items = await Transaction.find().populate('fromAccount toAccount cashierId');
  res.json(items);
});

router.post('/', async (req, res) => {
  const { type, amount, currency, fromAccount, toAccount, cashierId, comment } = req.body;
  if (!['deposit', 'withdrawal', 'transfer'].includes(type)) return res.status(400).json({ error: 'Invalid type' });
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Amount must be positive' });
  if (!currency || !['RUB', 'USD', 'EUR'].includes(currency)) return res.status(400).json({ error: 'Invalid currency' });

  try {
    let fromAcc, toAcc;
    if (type !== 'deposit') {
      fromAcc = await Account.findById(fromAccount);
      if (!fromAcc) return res.status(404).json({ error: 'Sender account not found' });
      if (fromAcc.status !== 'active') return res.status(400).json({ error: 'Sender account not active' });
      if (fromAcc.currency !== currency) return res.status(400).json({ error: 'Currency mismatch (sender)' });
      if (fromAcc.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });
    }
    if (type !== 'withdrawal') {
      toAcc = await Account.findById(toAccount);
      if (!toAcc) return res.status(404).json({ error: 'Recipient account not found' });
      if (toAcc.status !== 'active') return res.status(400).json({ error: 'Recipient account not active' });
      if (toAcc.currency !== currency) return res.status(400).json({ error: 'Currency mismatch (recipient)' });
    }
    if (type === 'transfer') {
      fromAcc.balance -= amount;
      toAcc.balance += amount;
      await fromAcc.save();
      await toAcc.save();
    } else if (type === 'withdrawal') {
      fromAcc.balance -= amount;
      await fromAcc.save();
    } else if (type === 'deposit') {
      toAcc.balance += amount;
      await toAcc.save();
    }
    const transaction = new Transaction({ type, amount, currency, fromAccount, toAccount, cashierId, comment });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const item = await Transaction.findById(req.params.id).populate('fromAccount toAccount cashierId');
  res.json(item);
});

module.exports = router; 