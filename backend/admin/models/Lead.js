const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ['demo', 'contact', 'inquiry'],
      default: 'demo',
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    firstName: {
      type: String,
      trim: true,
      default: '',
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    mobile: {
      type: String,
      trim: true,
      default: '',
    },
    organisation: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      trim: true,
      default: '',
    },
    orgSize: {
      type: String,
      default: '',
    },
    demoDate: {
      type: String,
      default: '',
    },
    useCases: {
      type: [String],
      default: [],
    },
    subject: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Scheduled', 'In Progress', 'Completed', 'Resolved', 'Closed'],
      default: 'New',
      index: true,
    },
    source: {
      type: String,
      default: 'Homepage',
    },
    notes: {
      type: String,
      default: '',
    },
    extra: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema, 'leads');
