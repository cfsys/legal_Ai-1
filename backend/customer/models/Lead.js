const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ['demo', 'contact', 'enterprise', 'newsletter'],
      default: 'demo',
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      default: '',
      trim: true,
    },
    lastName: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    mobile: {
      type: String,
      default: '',
      trim: true,
    },
    organisation: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      default: '',
      trim: true,
    },
    orgSize: {
      type: String,
      default: '',
      trim: true,
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
      default: '',
      trim: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Scheduled', 'Completed', 'Closed'],
      default: 'New',
    },
    source: {
      type: String,
      default: 'Homepage / Book Demo',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
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

module.exports = mongoose.model('Lead', leadSchema);
