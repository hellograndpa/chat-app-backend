const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    lastName: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    email: { type: String, require: true, unique: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    avatar: { type: String, default: 'image.jpg' },
    city: { type: String },
    age: { type: Number },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
