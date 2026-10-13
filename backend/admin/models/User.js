const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  ROLES,
  USER_STATUS,
  DEFAULT_CUSTOMER_PERMISSIONS,
  DEFAULT_ADMIN_PERMISSIONS,
  maskToPermissionsMap,
} = require('../constants/enums');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      default: '',
    },
    professionalType: {
      type: String,
      default: 'Advocate',
    },
    organisationName: {
      type: String,
      default: '',
    },
    firmId: {
      type: String,
      default: 'firm-1',
    },
    // Numeric Role: 1=Super Admin, 2=Firm Admin, 3=Partner, 4=Advocate, etc.
    role: {
      type: Number,
      default: ROLES.ADVOCATE,
    },
    plan: {
      type: String,
      default: 'Trial plan',
    },
    credits: {
      type: Number,
      default: 500,
    },
    // Numeric Permissions Bitmask: 1=Research, 2=Judgments, 4=Docs, 8=Contracts, etc.
    permissions: {
      type: Number,
      default: DEFAULT_CUSTOMER_PERMISSIONS,
    },
    avatar: {
      type: String,
      default: '',
    },
    // Numeric Status: 1=Active, 2=Pending, 3=Suspended
    status: {
      type: Number,
      enum: [USER_STATUS.ACTIVE, USER_STATUS.PENDING, USER_STATUS.SUSPENDED],
      default: USER_STATUS.ACTIVE,
    },
    lastActive: {
      type: String,
      default: 'Recently',
    },
    lastLogin: {
      type: String,
      default: '',
    },
    loginHistory: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for permissions map
userSchema.virtual('permissionsMap').get(function () {
  return maskToPermissionsMap(this.permissions);
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
