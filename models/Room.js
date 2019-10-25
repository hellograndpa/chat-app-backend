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
    avatar: { type: String, default: 'image.jpg' },
    city: { type: String },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    private: Boolean,
    numMaxUser: Number,
    theme: String,
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
