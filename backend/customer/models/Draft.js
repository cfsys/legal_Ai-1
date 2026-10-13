const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    draftType: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    matter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Draft', draftSchema);
