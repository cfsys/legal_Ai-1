const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    jurisdiction: {
      type: String,
      default: 'Supreme Court of India',
    },
    acts: {
      type: String,
      default: '',
    },
    depth: {
      type: String,
      enum: ['Quick', 'Standard', 'Deep Research'],
      default: 'Standard',
    },
    memorandum: {
      type: String,
      required: true,
    },
    authorities: [
      {
        title: String,
        citation: String,
        status: String,
        relevance: String,
      },
    ],
    status: {
      type: String,
      enum: ['completed', 'in_progress', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Research', researchSchema);
