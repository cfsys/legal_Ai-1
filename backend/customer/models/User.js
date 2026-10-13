const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  ROLES,
  USER_STATUS,
  AUTH_PROVIDER,
  PERMISSIONS,
  CUSTOMER_DEFAULT_PERMISSIONS,
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
    password: {
      type: String,
      required: true,
    },
    // Numeric Role: 1 = Admin, 2 = Customer
    role: {
      type: Number,
      enum: [ROLES.ADMIN, ROLES.CUSTOMER],
      default: ROLES.CUSTOMER,
    },
    plan: {
      type: String,
      default: 'Trial plan',
    },
    credits: {
      type: Number,
      default: 500,
    },
    // Numeric Permissions Bitmask: integer representing granted permissions
    // 1=Research, 2=Judgments, 4=Documents, 8=Contracts, 16=Drafting, 32=Matters, 64=Admin
    permissions: {
      type: Number,
      default: CUSTOMER_DEFAULT_PERMISSIONS,
    },
    avatar: {
      type: String,
      default: '',
    },
    // Numeric Auth Provider: 1 = Local, 2 = Google
    authProvider: {
      type: Number,
      enum: [AUTH_PROVIDER.LOCAL, AUTH_PROVIDER.GOOGLE],
      default: AUTH_PROVIDER.LOCAL,
    },
    // Numeric Status: 1 = Active, 2 = Pending, 3 = Suspended
    status: {
      type: Number,
      enum: [USER_STATUS.ACTIVE, USER_STATUS.PENDING, USER_STATUS.SUSPENDED],
      default: USER_STATUS.ACTIVE,
    },
    // User Table OTP Verification Fields
    otp: {
      type: String,
      default: null,
    },
    otpexpiriesin: {
      type: Date,
      default: null,
      alias: 'otpExpiresIn',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual helper for permissions map object
userSchema.virtual('permissionsMap').get(function () {
  return maskToPermissionsMap(this.permissions);
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
