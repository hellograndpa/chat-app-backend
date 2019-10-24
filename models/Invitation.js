const mongoose = require('mongoose');

const { Schema } = mongoose;

const invitationSchema = new Schema(
  {
    userFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    roomInvitation: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    message: { type: String },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;
