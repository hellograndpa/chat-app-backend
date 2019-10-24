const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatUserSchema = new Schema(
  {
    userListChat01: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userListChat02: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    conversation: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        timestamps: { createdAt: 'created_at' },
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
