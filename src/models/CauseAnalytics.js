const { Schema, model, models } = require('mongoose');
const Beacon = require('./Beacon');

const CauseAnalyticsSchema = new Schema({
  cause: {
    type: Schema.Types.ObjectId,
    ref: 'Cause',
    required: true,
  },
  beacons: [Beacon.schema],
},
  { timestamps: true }
);

module.exports = models.CauseAnalyticsSchema || model('CauseAnalytics', CauseAnalyticsSchema);
