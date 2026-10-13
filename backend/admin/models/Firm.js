const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    tier: {
      type: String,
      enum: ['Enterprise', 'Enterprise Tier', 'Law Firm Pro', 'Boutique', 'Boutique Tier', 'Trial'],
      default: 'Law Firm Pro',
    },
    seatsLimit: {
      type: Number,
      default: 20,
    },
    creditsTotal: {
      type: Number,
      default: 25000,
    },
    creditsUsed: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Trial'],
      default: 'Active',
    },
    contactEmail: {
      type: String,
      default: '',
    },
    billingCycle: {
      type: String,
      default: 'Annual',
    },
    city: {
      type: String,
      default: 'New Delhi',
    },
    state: {
      type: String,
      default: 'Delhi',
    },
    aiModelAllowed: {
      type: [String],
      default: ['GPT-4o Legal', 'LegalBERT-India'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Firm', firmSchema);
