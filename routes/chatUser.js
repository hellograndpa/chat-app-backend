const express = require('express');

const ChatUser = require('../models/ChatUser');

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

// get chat between users
router.get('/:id', async (req, res, next) => {
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

module.exports = router;

// update the data  // use req.body
router.put('/:id', async (req, res, next) => {
  const { userId, text, id } = req.body;
  try {
    const chatUser = await ChatUser.findById(id);
    if (
      (userId == chatUser.userChat01 || userId == chatUser.userChat02)
      && chatUser.status === 'active'
    ) {
      await ChatUser.findByIdAndUpdate(
        { _id: id },
        {
          conversation: [
            ...chatUser.conversation,
            {
              user: userId,
              text,
            },
          ],
        },
      );
      res.status(200).json({ code: 'modificado chat' });
    } else {
      res
        .status(404)
        .json({ code: `no existe - ${userId} - ${chatUser.userChat01}` });
    }
  } catch (error) {
    console.log(error);
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
