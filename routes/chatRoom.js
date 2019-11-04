const express = require('express');

const ChatRoom = require('../models/ChatRoom');

const router = express.Router();

// put a text into the chat
router.put('/:id', async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.params;
  try {
    const conversation = { user: req.session.currentUser._id, text };
    const chat = await ChatRoom.findByIdAndUpdate(
      id,
      {
        $push: { conversation },
      },
      { new: true },
    );
    res.json(chat);
  } catch (error) {
    res.status(300).json({ code: 'error on posting a chat' });
  }
});

module.exports = router;
