const moment = require('moment');
const { ObjectId } = require('mongoose').Types;

const CauseAnalytics = require('../models/CauseAnalytics');
const Beacon = require('../models/Beacon');

module.exports = {
  create(cause) {
    return CauseAnalytics.create({ cause });
  },
  addBeacon(data, cause, ip) {
    const beacon = new Beacon({...data, ip});
    return CauseAnalytics.updateOne({ cause }, { $push: { beacons: beacon } });
  },
  getTotalCauseViews(causeId) {
    return CauseAnalytics.aggregate([
      { $match: { cause: ObjectId(causeId) } },
      { $unwind: '$beacons' },
      {
        $facet: {
          totalQuery: [
            { $match: { 'beacons.event': 'PAGE_VIEW' } },
            { $count: 'value' }
          ],
        }
      },
      {
        $project: {
          _id: 0,
          views: {
            $cond: {
              if: { $size: '$totalQuery' },
              then: { $arrayElemAt: ['$totalQuery', 0] },
              else: 0
            }
          },
        }
      },
    ]);
  },
  getCauseViews(causeId, start, end) {
    return CauseAnalytics.aggregate([
      { $match: { cause: ObjectId(causeId) } },
      { $unwind: '$beacons' },
      {
        $facet: {
          dateViewsQuery: [
            {
              $match: {
                'beacons.event': 'PAGE_VIEW',
                'beacons.createdAt': { $gte: start, $lte: end }
              }
            },
            { $count: 'value' }
          ],
        }
      },
      {
        $project: {
          _id: 0,
          views: {
            $cond: {
              if: { $size: '$dateViewsQuery' },
              then: { $arrayElemAt: ['$dateViewsQuery', 0] },
              else: 0
            }
          },
        }
      },
    ]);
  },
  async getCauseAnalytics(causeId, options = { start: null, end: null, total: false }) {
    let cause, links;

    if (options.total) {
      [[cause]] = await Promise.all([this.getTotalCauseViews(causeId)]);
    }

    const views = cause.views ? cause.views.value : 0;

    return { views };
  }
};
