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
    const usr01 = await User.findById(userChat01);
    const usr02 = await User.findById(userChat02);

    const returnedConversation = {
      text: `${usr01.userName} ${usr01.lastName} has sent you an invitation"`,
    };

    SocketManager.emitMessage(
      `messageToUser-${usr02._id}`,
      returnedConversation,
    );

    return res.json(newChatUser);
  } catch (error) {
    next(error);
  }
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
      res.status(200).json({});
    }
  } catch (error) {
    next(error);
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
      res.status(200).json({});
    }
  } catch (error) {
    next(error);
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
      res.status(200).json({});
    }
  } catch (error) {
    next(error);
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
    next(error);
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

    const chat = await ChatUser.findByIdAndUpdate(
      { _id: id },
      {
        status,
      },
    ).populate('userChat01 userChat02');

    if (userId !== chatUser.userChat02) {
      const returnedConversation = {
        text: `${chat.userChat02.userName} ${chat.userChat02.lastName} has accepted your invitation`,
      };

      SocketManager.emitMessage(
        `messageToUser-${chatUser.userChat01}`,
        returnedConversation,
      );
    } else {
      const returnedConversation = {
        text: `${chat.userChat01.userName} ${chat.userChat01.lastName} has accepted your invitation`,
      };

      SocketManager.emitMessage(
        `messageToUser-${chatUser.userChat02}`,
        returnedConversation,
      );
    }

    res.status(200).json({ code: `${status} state modificated` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
