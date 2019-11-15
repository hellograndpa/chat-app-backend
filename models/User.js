const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    lastName: { type: String, default: '' },
    hashedPassword: { type: String, required: true },
    email: { type: String, require: true, unique: true },
    avatar: { type: String, default: 'image.jpg' },
    city: { type: String, default: '' },
    age: { type: Number, default: 0 },
    active: Boolean,
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    themes: [String],
    distanceFromMe: Number,
    location: {
      type: {
        type: String,
        enum: ['Point'], // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number],
      },
    },
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
