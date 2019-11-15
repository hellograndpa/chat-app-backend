const express = require('express');

const ChatUser = require('../models/ChatUser');

const User = require('../models/User');

const SocketManager = require('../services/socket');

const router = express.Router();

// Create chatUser
router.post('/', async (req, res, next) => {
  const { userChat01, userChat02 } = req.body;

  try {
    const newChatUser = await ChatUser.create({
      userChat01,
      userChat02,
      status: 'pending',
    });
    return res.json(newChatUser);
  } catch (error) {
    console.log('Some error happen - Please try again');
  }
  res.redirect('/');
});

// get my private chats
router.get('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  try {
    const chatUser = await ChatUser.find(
      { $or: [{ userChat01: userId }, { userChat02: userId }] },
      {
        _id: 1,
        userChat01: 1,
        userChat02: 1,
        conversation: 1,
        status: 1,
      },
    ).populate('userChat01 userChat02');

    if (chatUser) {
      res.json(chatUser);
    } else {
      res.status(404).json({ code: 'no existe' });
    }
  } catch (error) {
    console.log('Some error happen - Please try again');
    res.redirect('/');
  }
});
// get my private chats between two users
router.get('/between/:userId01/:userId02', async (req, res, next) => {
  const { userId01, userId02 } = req.params;
  try {
    const chatUser = await ChatUser.findOne(
      {
        $and: [
          { $or: [{ userChat01: userId01 }, { userChat02: userId01 }] },
          { $or: [{ userChat01: userId02 }, { userChat02: userId02 }] },
        ],
      },
      {
        _id: 1,
        userChat01: 1,
        userChat02: 1,
        status: 1,
      },
    ).populate('userChat01 userChat02');

    if (chatUser) {
      res.json(chatUser);
    } else {
      res.status(404).json({ code: 'no existe' });
    }
  } catch (error) {
    console.log('Some error happen - Please try again');
    res.redirect('/');
  }
});

// get a private chat
router.get('/private/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const chatUser = await ChatUser.findById(id)
      .populate('userChat01 userChat02')
      .populate('conversation.user');
    if (chatUser) {
      res.json(chatUser);
    } else {
      res.status(404).json({ code: 'no existe' });
    }
  } catch (error) {
    res.redirect('/');
  }
});

router.get('/me/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const chatUser = await ChatUser.findById(
      { _id: id },
      {
        userChat01: 1,
        userChat02: 1,
        conversation: 1,
        status: 1,
      },
    );
    if (chatUser) {
      res.json(chatUser);
    } else {
      res.status(404).json({ code: 'no existe' });
    }
  } catch (error) {
    console.log('Some error happen - Please try again');
    res.redirect('/');
  }
});

// update the data
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

    await ChatUser.findByIdAndUpdate(id, {
      $push: { conversation },
    });

    res.status(200).json('');
  } catch (error) {
    res.status(300).json({ code: 'error on posting a chat' });
  }
});

router.put('/:id/:status', async (req, res, next) => {
  const { id, status } = req.params;
  const userId = req.session.currentUser._id;
  try {
    const chatUser = await ChatUser.findById(id);

    if (status !== 'active' && status !== 'finished' && status !== 'refused') {
      res.status(300).json({ code: 'status is not correct' });
    }
    if (
      (status === 'active' || status === 'refused')
      && userId != chatUser.userChat02
    ) {
      res
        .status(300)
        .json({ code: `${userId} ${chatUser.userChat02}no eres usuario dos` });
    }
    if (userId != chatUser.userChat02 && userId != chatUser.userChat01) {
      res.status(300).json({ code: 'user is not correct' });
    }

    await ChatUser.findByIdAndUpdate(
      { _id: id },
      {
        status,
      },
    );
    res.status(200).json({ code: `${status} state modificated` });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
