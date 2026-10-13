const mongoose = require('mongoose');
const { JUDGMENT_STATUS } = require('../constants/enums');

const judgmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    court: {
      type: String,
      required: true,
      default: 'Supreme Court of India',
    },
    decisionDate: {
      type: String,
      required: true,
    },
    citation: {
      type: String,
      required: true,
    },
    // Status: supports both string labels ("Good Law", "Distinguished", "Overruled") and numeric enum values (1, 2, 3)
    status: {
      type: mongoose.Schema.Types.Mixed,
      default: 'Good Law',
    },
    bench: {
      type: String,
      default: '2 Judges',
    },
    judges: {
      type: String,
      default: '',
    },
    headnote: {
      type: String,
      default: '',
    },
    ratioDecidendi: {
      type: String,
      default: '',
    },
    aiSummary: {
      type: String,
      default: '',
    },
    actsAndSections: [
      {
        act: String,
        section: String,
      },
    ],
    casesCited: [String],
    citedBy: [String],
    highlights: [String],
    fullText: {
      type: String,
      default: 'Full judgment text is available in the Legal AI National Legal Repository archive.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Judgment', judgmentSchema);
