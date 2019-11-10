const express = require('express');

const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');

const SocketManager = require('../services/socket');

const router = express.Router();

// put a text into the chat
router.put('/:id', async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(req.session.currentUser._id);

    const returnedConversation = {
      user,
      text,
    };
    SocketManager.emitMessage(id, returnedConversation);

    const conversation = { user: req.session.currentUser._id, text };
    const chat = await ChatRoom.findByIdAndUpdate(id, {
      $push: { conversation },
    });

    res.json(chat);
  } catch (error) {
    res.status(300).json({ code: 'error on posting a chat' });
  }
});

module.exports = router;
