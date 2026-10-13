const mongoose = require('mongoose');

const masterDataSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    subType: {
      type: String,
      default: '',
      trim: true,
    },
    jurisdiction: {
      type: String,
      default: '',
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast queries by category and name
masterDataSchema.index({ category: 1, name: 1 });

module.exports = mongoose.model('MasterData', masterDataSchema);
