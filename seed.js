const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const Client = require('./models/Client');
const Account = require('./models/Account');
const Transaction = require('./models/Transaction');
const Cashier = require('./models/Cashier');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log('Clearing old data...');
  await Client.deleteMany();
  await Account.deleteMany();
  await Transaction.deleteMany();
  await Cashier.deleteMany();

  console.log('Seeding new data...');

  // Кассиры
  const cashiers = [];
  for (let i = 0; i < 5; i++) {
    cashiers.push(await Cashier.create({
      firstName: faker.person.firstName('female'),
      lastName: faker.person.lastName('female'),
      position: 'Cashier Operator',
      branch: faker.helpers.arrayElement(['Main Branch', 'Westside Branch', 'Downtown Branch'])
    }));
  }

  // Клиенты и их счета
  const accounts = [];
  for (let i = 0; i < 20; i++) {
    const client = await Client.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      passportSeries: faker.string.numeric(4),
      passportNumber: faker.string.numeric(6),
      tin: faker.string.numeric(12),
      type: 'individual'
    }); 

    accounts.push(await Account.create({
      clientId: client._id,
      accountNumber: faker.finance.accountNumber(),
      currency: faker.helpers.arrayElement(['RUB', 'USD', 'EUR']),
      balance: faker.finance.amount({ min: 1000, max: 100000, dec: 2 }),
      status: 'active'
    }));
  }

  // Транзакции
  for (let i = 0; i < 50; i++) {
    const type = faker.helpers.arrayElement(['deposit', 'withdrawal', 'transfer']);
    const fromAccount = faker.helpers.arrayElement(accounts);
    let toAccount = null;

    if (type === 'transfer') {
        do {
            toAccount = faker.helpers.arrayElement(accounts);
        } while (toAccount._id.equals(fromAccount._id));
    }

    await Transaction.create({
      type,
      amount: faker.finance.amount({ min: 100, max: 5000, dec: 2 }),
      currency: fromAccount.currency,
      fromAccount: (type === 'withdrawal' || type === 'transfer') ? fromAccount._id : null,
      toAccount: (type === 'deposit' || type === 'transfer') ? (type === 'deposit' ? fromAccount._id : toAccount._id) : null,
      cashierId: faker.helpers.arrayElement(cashiers)._id,
      comment: faker.lorem.sentence()
    });
  }

  console.log('Test data seeded successfully!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
}); 