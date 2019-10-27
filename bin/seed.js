const mongoose = require('mongoose');
const faker = require('faker');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const bcryptSalt = 10;

require('dotenv').config();

mongoose.set('useCreateIndex', true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to: ', process.env.MONGO_URL);
  })
  .catch((error) => {
    console.error(error);
  });

const users = Array.from(
  {
    length: 50,
  },
  () => ({
    userName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    hashedPassword: bcrypt.hashSync('1234', bcrypt.genSaltSync(bcryptSalt)),
    city: 'Barcelona',
    age: Math.floor(Math.random() * (65 - 25 + 1)) + 25,
    active: true,
    location: {
      type: 'Point',
      coordinates: [faker.address.latitude(), faker.address.longitude()],
    },
  }),
);

User.collection
  .drop()
  .then(() => {
    console.log('deleted db');
    console.log(users);
  })
  .catch((err) => {
    console.log(err);
  })
  .then(() => User.insertMany(users))
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });
