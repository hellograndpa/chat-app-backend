const mongoose = require('mongoose');

const { Schema } = mongoose;

const socketSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    socketId: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Socket = mongoose.model('Socket', socketSchema);

module.exports = Socket;
