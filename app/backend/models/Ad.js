const mongoose = require('mongoose');

const adSchema = mongoose.Schema({

  title: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Ad', adSchema);
