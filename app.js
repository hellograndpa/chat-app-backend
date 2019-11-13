const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors')({
  origin: true,
  credentials: true,
});
require('dotenv').config();

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const roomsRouter = require('./routes/rooms');
const socketsRouter = require('./routes/sockets');
const chatUserRouter = require('./routes/chatUser');
const chatRoomRouter = require('./routes/chatRoom');
const uploadRouter = require('./routes/upload');

const app = express();
app.set('trust proxy', true);
app.use(cors);
app.options('*', cors);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'talk-in', // configuracion del nombre de la cookie
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none', // esta es la linea importante
      secure: process.env.NODE_ENV === 'production',
    },
  }),
);

app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
});

app.use('/', authRouter);
app.use('/api/v01/user', usersRouter);
app.use('/api/v01/room', roomsRouter);
app.use('/api/v01/sockets', socketsRouter);
app.use('/api/v01/chat-user', chatUserRouter);
app.use('/api/v01/chat-room', chatRoomRouter);
app.use('/api/v01/upload', uploadRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ code: 'not found' });
});

app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500).json({ code: 'unexpected' });
  }
});

module.exports = app;
