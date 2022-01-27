const { Schema, models, model } = require('mongoose');

const SessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  tokenType: { type: String, enum: ['Bearer', 'X-API-Key', ''], default: '' },
  userAgent: {
    platform: String,
    os: String,
    browser: String,
    browserVersion: String,
    device: String,
    raw: String
  },
  location: {
    city: String,
    region: String,
    country: String,
    ip: String
  },
  active: { type: Boolean },
  success: { type: Boolean }
}, {
  timestamps: true
});

module.exports = models.SessionSchema || model('Session', SessionSchema);
