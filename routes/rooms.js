const express = require('express');

const mongoose = require('mongoose');

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
router.post('/', checkIfLoggedIn, async (req, res) => {
  try {
    const { latitude, longitude, radiusInMeters } = req.body;

    const coords = [parseFloat(latitude), parseFloat(longitude)];

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

// Get rooms where i'm
router.get('/me/:userId', checkIfLoggedIn, async (req, res) => {
  try {
    const { userId } = req.params;
    const room = await Room.find({ adminList: { $in: [userId] } });
    res.json(room);
  } catch (error) {
    res.status(300).json({ code: 'error on getting a room' });
  }
});

// Get a room
router.get('/:id', checkIfLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id)
      .populate('chat')
      .populate({ path: 'chat', populate: { path: 'conversation.user' } })
      .populate('activeUsers');

    res.json(room);
  } catch (error) {
    res.status(300).json({ code: 'error on getting a room' });
  }
});

// Create a room
router.post('/new', checkIfLoggedIn, async (req, res) => {
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
    try {
      newRoom = await Room.create({
        roomName,
        description,
        location,
        avatar,
        city,
        chat,
        privateRoom,
        adminList: [userId],
        activeUsers: [],
        numMaxUser,
        theme,
        filter,
      });
      global.io.emit('room-created', newRoom);

      res.status(200).json(newRoom);
    } catch (error) {
      console.log(error);
      res.status(300).json({ code: error });
    }
  } catch (error) {
    console.log(error);
    res.status(300).json({ code: 'error on creating the room' });
  }
  return res.json(newRoom);
});

// Put new user into a room
router.put('/:id/new-user', async (req, res, next) => {
  const { id } = req.params;
  try {
    const users = await Room.findById(id, { activeUsers: 1 }).populate(
      'activeUsers',
    );

    const user = users.activeUsers.filter(
      el => el._id == req.session.currentUser._id,
    );

    if (user.length === 0) {
      const room = await Room.findByIdAndUpdate(
        id,
        {
          $push: {
            activeUsers: req.session.currentUser._id,
          },
        },
        { safe: true, upsert: true, new: true },
      ).populate('activeUsers');

      global.io.sockets.emit('user-in-chat', room.activeUsers);
      res.json(room);
    } else {
      global.io.sockets.emit('user-in-chat', users.activeUsers);
      res.status(200).json('');
    }
  } catch (error) {
    res.status(300).json({ code: '' });
  }
});
// Put new user into a room
router.delete('/:id/delete-user', async (req, res, next) => {
  const { id } = req.params;
  console.log('delete', id);
  try {
    const room = await Room.findByIdAndUpdate(
      id,
      {
        $pull: {
          activeUsers: req.session.currentUser._id,
        },
      },
      { safe: true, upsert: true, new: true },
    ).populate('activeUsers');

    global.io.sockets.emit('user-in-chat', room.activeUsers);

    res.json(room);
  } catch (error) {
    res.status(300).json({ code: '' });
  }
});

module.exports = router;
