const express = require('express');

const User = require('../models/User');

const router = express.Router();

const { checkIfLoggedIn, metersToRadian } = require('../middlewares');

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
  console.log('TCL: req.body', req.body);
  try {
    await User.findByIdAndUpdate(req.session.currentUser._id, {
      userName,
      lastName,
      email,
      age: Number(age),
      city,
      location: {
        coordinates: [latitude, longitude],
      },
    });

    res.status(200).json({ code: 'modificado' });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
