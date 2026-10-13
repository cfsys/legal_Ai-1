const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Security',
    },
    actorName: {
      type: String,
      default: 'System Admin',
    },
    actorEmail: {
      type: String,
      default: 'admin@themes.ai',
    },
    targetUser: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['INFO', 'SUCCESS', 'WARN', 'WARNING', 'ERROR', 'DANGER'],
      default: 'INFO',
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
