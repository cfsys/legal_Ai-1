const mongoose = require('mongoose');

const aiModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    costPer1kTokens: {
      type: String,
      default: '0.02 Credits',
    },
    latency: {
      type: String,
      default: '0.9s',
    },
    contextWindow: {
      type: String,
      default: '128k',
    },
    status: {
      type: String,
      default: 'Operational',
    },
    primaryUse: {
      type: String,
      default: 'General Legal Intelligence',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AiModel', aiModelSchema);
