const { Schema, models, model } = require('mongoose');

const UserSchema = new Schema({
  name: { type: String },
  picture: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, trim: true },
  city: { type: String, trim: true, default: '' },
  state: { type: String, trim: true, default: '' },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  lastLogin: { type: Date, default: null },
  loginCount: { type: Number, default: 0 },
  roles: [{ type: String }],
  language: { type: String, default: 'default' },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = models.UserSchema || model('User', UserSchema);
