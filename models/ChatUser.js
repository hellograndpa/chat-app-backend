const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatUserSchema = new Schema(
  {
    userChat01: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userChat02: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'active', 'finished', 'refused'],
      default: 'pending',
    },
    conversation: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        created: {
          type: Date,
          default: () => Date.now(),
        },
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const ChatUser = mongoose.model('Chat', chatUserSchema);

module.exports = ChatUser;
