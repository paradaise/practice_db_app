const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();



const Material = require('./models/Material');
const Warehouse = require('./models/Warehouse');
const Stock = require('./models/Stock');
const Movement = require('./models/Movement');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Очистка коллекций
  await Material.deleteMany();
  await Warehouse.deleteMany();
  await Stock.deleteMany();
  await Movement.deleteMany();

  // Материалы
  const materials = [];
  for (let i = 0; i < 10; i++) {
    materials.push(await Material.create({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      unit: faker.helpers.arrayElement(['шт', 'кг', 'л', 'м']),
      sku: faker.string.alphanumeric(8),
      price: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
      manufacturer: faker.company.name()
    }));
  }

  // Склады
  const warehouses = [];
  for (let i = 0; i < 3; i++) {
    warehouses.push(await Warehouse.create({
      name: `Склад №${i + 1}`,
      address: faker.location.streetAddress(),
      phone: faker.phone.number('+7 (###) ###-##-##'),
      email: faker.internet.email(),
      manager: faker.person.fullName()
    }));
  }

  // Остатки
  const stocks = [];
  for (let i = 0; i < 30; i++) {
    stocks.push(await Stock.create({
      material: faker.helpers.arrayElement(materials)._id,
      warehouse: faker.helpers.arrayElement(warehouses)._id,
      quantity: faker.number.int({ min: 0, max: 500 }),
      lastUpdated: faker.date.recent({ days: 30 })
    }));
  }

  // Движения
  for (let i = 0; i < 20; i++) {
    const type = faker.helpers.arrayElement(['in', 'out', 'move']);
    let fromWarehouse = null, toWarehouse = null;
    if (type === 'move') {
      fromWarehouse = faker.helpers.arrayElement(warehouses)._id;
      do {
        toWarehouse = faker.helpers.arrayElement(warehouses)._id;
      } while (toWarehouse.equals(fromWarehouse));
    } else if (type === 'in') {
      toWarehouse = faker.helpers.arrayElement(warehouses)._id;
    } else if (type === 'out') {
      fromWarehouse = faker.helpers.arrayElement(warehouses)._id;
    }
    await Movement.create({
      material: faker.helpers.arrayElement(materials)._id,
      fromWarehouse,
      toWarehouse,
      quantity: faker.number.int({ min: 1, max: 100 }),
      date: faker.date.recent({ days: 30 }),
      type,
      comment: faker.lorem.sentence(),
      operator: faker.person.fullName()
    });
  }

  console.log('Test data was seeded!');
  await mongoose.disconnect();
}

seed(); 