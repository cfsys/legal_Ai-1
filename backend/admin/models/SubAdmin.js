const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const subAdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    password: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      trim: true,
      default: '',
    },
    deviceLimit: {
      type: String,
      default: '3',
    },
    salesPerson: {
      type: String,
      default: 'No',
    },
    role: {
      type: String,
      default: 'Operations Sub-Admin',
    },
    roleTitle: {
      type: String,
      default: 'Operations Sub-Admin',
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
    mobile: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: 'Administration',
    },
    status: {
      type: Number,
      enum: [1, 2, 3], // 1=Active, 2=Pending, 3=Suspended
      default: 1,
    },
    // Top-Level CRUD Permission Flags
    permissions: {
      canView: { type: Boolean, default: true },
      canCreate: { type: Boolean, default: false },
      canEdit: { type: Boolean, default: false },
      canDelete: { type: Boolean, default: false },
      // Granular Module-wise Breakdown: { [moduleId]: { read: bool, create: bool, edit: bool, delete: bool } }
      modules: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
    lastLogin: {
      type: String,
      default: 'Never',
    },
    assignedBy: {
      type: String,
      default: 'Super Admin',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Hash password before saving
subAdminSchema.pre('save', async function (next) {
  if (!this.email) {
    this.email = `${this.username.toLowerCase()}@legalai.in`;
  }
  if (!this.roleTitle && this.role) {
    this.roleTitle = this.role;
  }
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
subAdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('SubAdmin', subAdminSchema);
