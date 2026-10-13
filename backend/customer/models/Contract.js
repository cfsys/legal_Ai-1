const mongoose = require('mongoose');
const { CONTRACT_RISK } = require('../constants/enums');

const contractSchema = new mongoose.Schema(
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
    type: {
      type: String,
      default: 'Service Agreement',
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    riskScore: {
      type: Number,
      required: true,
      default: 50,
    },
    // Risk Level: supports both string labels ("Low", "Medium", "High") and numeric enum values (1, 2, 3)
    riskLevel: {
      type: mongoose.Schema.Types.Mixed,
      default: 'Medium',
    },
    analysis: {
      criticalIssues: [String],
      recommendedAmendments: [String],
      clausesReviewed: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Contract', contractSchema);
