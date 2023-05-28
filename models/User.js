const { Schema, model } = require('mongoose');

const UserShema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ['Employee'],
  },
  active: {
    type: Boolean,
    default: true,
  },
});
module.exports = model('User', UserShema);
