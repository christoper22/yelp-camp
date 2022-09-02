const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMangoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(passportLocalMangoose);

module.exports = mongoose.model('User', UserSchema);
