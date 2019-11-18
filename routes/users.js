const express = require('express');

const User = require('../models/User');

const router = express.Router();

const { metersToRadian } = require('../middlewares');

// Get user listing all
router.post('/', async (req, res, next) => {
  try {
    const { latitude, longitude, radiusInMeters } = req.body;

    const coords = [parseFloat(latitude), parseFloat(longitude)];

    const users = await User.find(
      {
        'location.coordinates': {
          $geoWithin: {
            $centerSphere: [coords, metersToRadian(radiusInMeters)],
          },
        },
      },
      {
        _id: 1,
        userName: 1,
        lastName: 1,
        city: 1,
        email: 1,
        age: 1,
        location: 1,
        avatar: 1,
        active: 1,
        themes: 1,
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
    const user = await User.findById({ _id: id });
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

// update the data  // use req.body
router.put('/:id', async (req, res, next) => {
  const {
    userName,
    lastName,
    city,
    age,
    email,
    latitude,
    longitude,
  } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        userName,
        lastName,
        email,
        age: Number(age),
        city,
        location: {
          coordinates: [latitude, longitude],
        },
      },
      { new: true },
    );
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// update the data  // use req.body
router.put('/:id/image', async (req, res, next) => {
  const { avatar } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        avatar,
      },
      { new: true },
    );
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
