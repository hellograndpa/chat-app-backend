const express = require('express');

const Room = require('../models/Room');

const { checkIfLoggedIn, metersToRadian } = require('../middlewares');

const router = express.Router();

// Get rooms available from location
router.get('/', async (req, res, next) => {
  try {
    const { lat, long, radiusInMeters } = req.query;
    const coords = [parseFloat(lat), parseFloat(long)];

    const rooms = await Room.find({
      'location.coordinates': {
        $geoWithin: { $centerSphere: [coords, metersToRadian(radiusInMeters)] },
      },
    });

    res.json(rooms);
  } catch (error) {
    console.log('Some error happen - Please try again');
    res.redirect('/');
  }
});

router.post('/', checkIfLoggedIn, async (req, res, next) => {
  let newRoom = {};
  try {
    // TODO: Create the chat first
    const {
      roomName,
      description,
      longitude,
      latitude,
      avatar,
      city,
      privateRoom,
      numMaxUser,
      theme,
      single,
      family,
      pet,
    } = req.body;
    const location = { type: 'Point', coordinates: [longitude, latitude] };
    const userId = req.session.currentUser._id;
    const filter = { single, family, pet };
    newRoom = await Room.create({
      roomName,
      description,
      location,
      avatar,
      city,
      privateRoom,
      adminList: [userId],
      numMaxUser,
      theme,
      filter,
    });
  } catch (error) {
    next(error);
  }
  return res.json(newRoom);
});

module.exports = router;
