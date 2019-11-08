const User = require('../models/User');

module.exports = {
  updateStatusConected: async (userId) => {
    await User.findByIdAndUpdate(userId, { active: true });
  },
  updateStatusDisconected: async (userId) => {
    await User.findByIdAndUpdate(userId, { active: false });
  },
};
