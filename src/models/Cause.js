const { Schema, models, model } = require('mongoose');

const CauseSchema = new Schema({
  name: { type: String, trim: true, required: true },
  avatar: { type: String, trim: true, default: '' },
  title: { type: String, trim: true, default: '' },
  image: { type: String, trim: true, default: '' },
  city: { type: String, trim: true, default: '' },
  state: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  paymentUrl: { type: String, trim: true, default: '' },
  banners: [String],
  default: {
    amount: { type: Number, default: 0 },
    paymentMethod: { type: String, trim: true, default: '' },
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  isGlobal: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  confirmed: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = models.CauseSchema || model('Cause', CauseSchema);
