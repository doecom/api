const { Schema, model, models } = require('mongoose');

const DonationSchema = new Schema({
  cause: {
    type: Schema.Types.ObjectId,
    ref: 'Cause',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  email: { type: String, default: '' },
  amount: { type: Number, default: 0 },
  paymentMethod: { type: String, trim: true, default: '' },
  confirmed: { type: Boolean, default: false },
  feedback: { type: Schema.Types.Mixed }
},
  { timestamps: true }
);

module.exports = models.DonationSchema || model('Donation', DonationSchema);
