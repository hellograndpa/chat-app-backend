const express = require('express');

const Room = require('../models/Room');

const ChatRoom = require('../models/ChatRoom');

const { checkIfLoggedIn, metersToRadian } = require('../middlewares');

const router = express.Router();

async function createChat() {
  try {
    const chat = await ChatRoom.create({ conversation: [] });
    return chat._id;
  } catch (error) {
    return '';
  }
}

// Get rooms available from location
router.get('/', checkIfLoggedIn, async (req, res) => {
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
    res.status(300).json({ code: 'error on getting rooms available' });
  }
});

// Get a room
router.get('/:id', checkIfLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id).populate('chat');

    res.json(room);
  } catch (error) {
    res.status(300).json({ code: 'error on getting a room' });
  }
});

router.post('/', checkIfLoggedIn, async (req, res) => {
  let newRoom = {};
  try {
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
    const chat = await createChat();
    newRoom = await Room.create({
      roomName,
      description,
      location,
      avatar,
      city,
      chat,
      privateRoom,
      adminList: [userId],
      numMaxUser,
      theme,
      filter,
    });
  } catch (error) {
    res.status(300).json({ code: 'error on creating the room' });
  }
  return res.json(newRoom);
});

module.exports = router;
