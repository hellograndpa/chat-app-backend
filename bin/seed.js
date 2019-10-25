require('dotenv').config();

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const faker = require('faker');

const User = require('../models/User');

const House = require('../models/House');

const bcryptSalt = 10;

mongoose.connect(process.env.DB_HOST, {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
});

const users = Array.from(
  {
    length: 50,
  },
  () => ({
    username: {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
    },
    email: faker.internet.email(),
    bio: faker.lorem.paragraph(2),
    birthday: '19-01-1981',
    gender: 'male',
    address: {
      street: faker.address.streetName(),
      city: faker.address.city(),
      state: faker.address.state(),
      country: 'España',
      zip: faker.address.zipCode(),
    },
    idCard: faker.random.alphaNumeric(10),
    phone: [faker.phone.phoneNumberFormat()],
    adminUser: false,
    mentorUser: false,
    grandpaUser: false,
    hashpass: bcrypt.hashSync('1234', bcrypt.genSaltSync(bcryptSalt)),
    active: true,
  }),
);
