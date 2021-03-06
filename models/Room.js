const mongoose = require('mongoose');

const { Schema } = mongoose;

const roomSchema = new Schema(
  {
    roomName: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    adminList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    userAdmitList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    userBanList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    avatar: {
      type: String,
      default: 'https://engineering.fb.com/wp-content/uploads/2009/02/chat.jpg',
    },
    city: { type: String },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' },
    privateRoom: { type: Boolean, default: false },
    numMaxUser: Number,
    theme: String,
    language: String,
    activeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    participatedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    filter: {
      single: Boolean,
      family: Boolean,
      pet: Boolean,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
