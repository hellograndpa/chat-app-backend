const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new Schema(
  {
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

const ChatRoom = mongoose.model('ChatRoom', chatSchema);

module.exports = ChatRoom;
