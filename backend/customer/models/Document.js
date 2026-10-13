const mongoose = require('mongoose');
const { DOCUMENT_STATUS } = require('../constants/enums');

const documentSchema = new mongoose.Schema(
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
    pages: {
      type: Number,
      default: 1,
    },
    // Status: supports both string labels ("Ready", "Processing", "Failed") and numeric enum values (1, 2, 3)
    status: {
      type: mongoose.Schema.Types.Mixed,
      default: 'Ready',
    },
    isConfidential: {
      type: Boolean,
      default: false,
    },
    uploadDate: {
      type: String,
      default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    fileData: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    sections: [
      {
        pageNumber: Number,
        heading: String,
        content: String,
      },
    ],
    aiAnalysis: {
      summary: String,
      dates: [String],
      parties: [String],
      obligations: [String],
      clauses: [String],
      risks: [String],
      chronology: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', documentSchema);
