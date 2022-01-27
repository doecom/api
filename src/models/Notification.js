const { Schema, models, model } = require('mongoose');

const NotificationSchema = new Schema({
  title: { type: String },
  receiver: { type: String },
  type: { type: String, enum: ['SUCCESS', 'INFO', 'WARNING', 'DANGER'], default: 'INFO' },
  message: { type: String, default: '' },
  details: { type: Schema.Types.Mixed },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = models.NotificationSchema || model('Notification', NotificationSchema);
