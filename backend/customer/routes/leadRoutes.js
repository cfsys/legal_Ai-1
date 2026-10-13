const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { getIsMongooseConnected } = require('../config/db');
const { escapeRegex } = require('../utils/sanitize');

// In-memory fallback if database is temporarily offline
let inMemoryLeads = [];

// @desc    Capture lead, contact inquiry, or demo booking
// @route   POST /api/leads or POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      kind = 'contact',
      name,
      firstName,
      lastName,
      email,
      mobile,
      organisation,
      role,
      subject,
      orgSize,
      demoDate,
      useCases,
      message,
      source = 'Homepage / Contact Us',
      extra = {},
    } = req.body;

    const resolvedName = (name || `${firstName || ''} ${lastName || ''}`).trim();

    if (!resolvedName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required to submit your inquiry.',
      });
    }

    const leadData = {
      kind,
      name: resolvedName,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email.toLowerCase().trim(),
      mobile: mobile || '',
      organisation: organisation || '',
      role: role || '',
      subject: subject || extra?.subject || '',
      orgSize: orgSize || extra?.orgSize || '',
      demoDate: demoDate || extra?.demoDate || '',
      useCases: Array.isArray(useCases)
        ? useCases
        : Array.isArray(extra?.useCases)
        ? extra.useCases
        : [],
      message: message || '',
      status: 'New',
      source,
      notes: '',
      extra,
    };

    let savedLead = null;

    if (getIsMongooseConnected()) {
      savedLead = await Lead.create(leadData);
      console.log(
        `[MongoDB 📥 Inbound ${savedLead.kind.toUpperCase()} Saved] ${savedLead.name} (${savedLead.email}, ${savedLead.organisation}) ID: ${savedLead._id}`
      );
    } else {
      savedLead = {
        ...leadData,
        _id: `lead_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryLeads.unshift(savedLead);
      console.log(
        `[Memory Fallback 📥 Inbound ${savedLead.kind.toUpperCase()} Saved] ${savedLead.name} (${savedLead.email})`
      );
    }

    const successMessage =
      kind === 'contact'
        ? 'Thank you! Your message has been received. Our legal operations team will review and respond shortly.'
        : 'Thank you! Your demo request has been received. Our senior legal solutions consultant will be in touch shortly.';

    return res.status(201).json({
      success: true,
      message: successMessage,
      data: savedLead,
    });
  } catch (error) {
    console.error('[Lead/Contact Submission Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing inquiry: ' + error.message,
    });
  }
});

// @desc    Get all leads & contact inquiries (for Admin side panel)
// @route   GET /api/leads or GET /api/contact
// @access  Public / Admin
router.get('/', async (req, res) => {
  try {
    const { kind, status, search } = req.query;
    let query = {};

    if (kind && kind !== 'all') {
      query.kind = kind;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { organisation: regex },
        { subject: regex },
        { mobile: regex },
      ];
    }

    if (getIsMongooseConnected()) {
      const leads = await Lead.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: leads.length, leads });
    }

    let filtered = [...inMemoryLeads];
    if (kind && kind !== 'all') {
      filtered = filtered.filter((l) => l.kind === kind);
    }
    if (status && status !== 'all') {
      filtered = filtered.filter((l) => l.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          (l.name && l.name.toLowerCase().includes(s)) ||
          (l.email && l.email.toLowerCase().includes(s)) ||
          (l.organisation && l.organisation.toLowerCase().includes(s))
      );
    }

    return res.json({ success: true, count: filtered.length, leads: filtered });
  } catch (error) {
    console.error('[Get Leads Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update inquiry status or internal admin notes
// @route   PATCH /api/leads/:id or PATCH /api/contact/:id
// @access  Admin
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    if (getIsMongooseConnected()) {
      const updated = await Lead.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Inquiry not found' });
      }

      return res.json({ success: true, message: 'Inquiry updated successfully', data: updated });
    }

    const idx = inMemoryLeads.findIndex((l) => String(l._id) === String(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    inMemoryLeads[idx] = {
      ...inMemoryLeads[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return res.json({
      success: true,
      message: 'Inquiry updated successfully',
      data: inMemoryLeads[idx],
    });
  } catch (error) {
    console.error('[Update Inquiry Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete an inquiry
// @route   DELETE /api/leads/:id or DELETE /api/contact/:id
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsMongooseConnected()) {
      const deleted = await Lead.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Inquiry not found' });
      }
      return res.json({ success: true, message: 'Inquiry deleted successfully' });
    }

    inMemoryLeads = inMemoryLeads.filter((l) => String(l._id) !== String(id));
    return res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('[Delete Inquiry Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
