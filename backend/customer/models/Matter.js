const mongoose = require('mongoose');

const matterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    matterNumber: {
      type: String,
      required: true,
      unique: true,
    },
    court: {
      type: String,
      default: 'Supreme Court of India',
    },
    clientName: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      default: 'Pre-litigation / Research',
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Closed'],
      default: 'Active',
    },
    nextHearingDate: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Matter', matterSchema);
