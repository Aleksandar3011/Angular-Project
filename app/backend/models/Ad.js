const mongoose = require('mongoose');

const adSchema = mongoose.Schema({

  title: {
    type: String,
    required: true
  },
  tech: {
    type: String,
    required: true
  },
  itField: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
});

module.exports = mongoose.model('Ad', adSchema);
