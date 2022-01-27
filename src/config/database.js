const mongoose = require('mongoose');

module.exports = {
  setup() {
    mongoose.connect(
      process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      err => {
        if (err) {
          console.log(`>> db connection error: ${err.message}`);
        }
        console.log('>> db connection stablished');
      }
    );
  }
};
