const express = require('express');
const bcrypt = require('bcrypt');

const { checkUsernameAndPasswordNotEmpty } = require('../middlewares');

const User = require('../models/User');

const bcryptSalt = 10;

const router = express.Router();

router.get('/me', (req, res, next) => {
  if (req.session.currentUser) {
    res.status(200).json(req.session.currentUser);
  } else {
    res.status(401).json({ code: 'unauthorized' });
  }
});

router.post(
  '/signup',
  checkUsernameAndPasswordNotEmpty,
  async (req, res, next) => {
    const {
 userName, email, password, latitude, longitude 
} = res.locals.auth;

    try {
      console.log(res.locals.auth);
      const user = await User.findOne({ email });

      if (user) {
        return res.status(422).json({ code: 'username-not-unique' });
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);

      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = await User.create({
        userName,
        email,
        hashedPassword,
        location: {
          coordinates: [latitude, longitude],
          type: 'Point',
        },
      });
      req.session.currentUser = newUser;
      return res.json(newUser);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/login',
  checkUsernameAndPasswordNotEmpty,
  async (req, res, next) => {
    const {
 email, password, latitude, longitude 
} = res.locals.auth;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ code: 'not-found' });
      }
      if (bcrypt.compareSync(password, user.hashedPassword)) {
        req.session.currentUser = user;
        await User.findByIdAndUpdate(user._id, {
          location: {
            coordinates: [latitude, longitude],
            type: 'Point',
          },
          active: true,
        });

        global.io.emit('login');

        return res.json(user);
      }
      return res.status(404).json({ code: 'not-found' });
    } catch (error) {
      next(error);
    }
  },
);

router.get('/logout', async (req, res, next) => {
  await User.findByIdAndUpdate(req.session.currentUser._id, {
    active: false,
  });

  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    return res.status(204).send();
  });
});

router.get('/abandon', async (req, res, next) => {
  global.io.emit('logout', req.session.currentUser);
  await User.findByIdAndUpdate(req.session.currentUser._id, {
    active: false,
  });
  return res.status(200).send('');
});
router.get('/remember', async (req, res, next) => {
  global.io.emit('login', req.session.currentUser);
  await User.findByIdAndUpdate(req.session.currentUser._id, {
    active: true,
  });
  return res.status(200).send('');
});
module.exports = router;
