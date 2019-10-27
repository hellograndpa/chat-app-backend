const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const router = express.Router();

const bcryptSalt = 10;

// Get user listing all
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find(
      {},
      {
        _id: 1,
        userName: 1,
        lastName: 1,
        city: 1,
        email: 1,
        age: 1,
        location: 1,
      },
    );
    res.json(users);
  } catch (error) {
    console.log('Some error happen - Please try again');
    res.redirect('/');
  }
});

// get a user
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(
      { _id: id },
      {
        _id: 1,
        userName: 1,
        lastName: 1,
        city: 1,
        email: 1,
        age: 1,
        location: 1,
      },
    );
    if (user) {
      res.json(user);
    } else {
      console.log('user not exit');
      res.redirect('/');
    }
  } catch (error) {
    console.log('Some error happen - Please try again');
    res.redirect('/');
  }
});

module.exports = router;

// update the data  // use req.body
router.put('/:id', async (req, res, next) => {
  const {
 userName, lastName, city, age, latitude, longitude 
} = req.body;
  try {
    await User.findByIdAndUpdate(req.session.currentUser, {
      userName,
      lastName,
      city,
      age,
      location: {
        coordinates: [latitude, longitude],
      },
    });

    req.flash('info', 'Your profile has been update');
    res.redirect('/user/step-1');
  } catch (error) {
    req.flash('error', 'Some error happen - Please try again');
    res.redirect('/user/step-1');
  }
});

module.exports = router;
