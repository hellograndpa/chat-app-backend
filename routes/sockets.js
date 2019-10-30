const express = require('express');

const Socket = require('../models/Socket');

const router = express.Router();

// create socket
router.post('/', async (req, res, next) => {
  let newSocket = {};
  try {
    const userId = req.session.currentUser._id;
    const { socketId } = req.body;

    newSocket = await Socket.create({
      userId,
      socketId,
    });
  } catch (error) {
    res.status(300).json({ code: 'error saving soket on bd' });
  }
  return res.json(newSocket);
});

module.exports = router;
