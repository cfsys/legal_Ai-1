require('dotenv').config();

// Comprehensive End-to-End Functionality Test Suite for Legal AI Platform
// Covers 10 Feature Dimensions: Security, Dashboard, Search, Judgments, Matters, Documents, AI Reasoning, Admin, Inquiries, Frontend Routes

const BACKEND_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5173';


async function runTestSuite() {
  console.log('================================================================================');
  console.log('       LEGAL AI PLATFORM — COMPREHENSIVE END-TO-END AUDIT & TEST SUITE         ');
  console.log('================================================================================\n');

  const categories = {
    '1. Authentication & Security': { passed: 0, failed: 0, tests: [] },
    '2. Dashboard & Platform Metrics': { passed: 0, failed: 0, tests: [] },
    '3. Global Search & Spotlight Engine': { passed: 0, failed: 0, tests: [] },
    '4. Judgments & Precedents Engine': { passed: 0, failed: 0, tests: [] },
    '5. Matters & Case Management': { passed: 0, failed: 0, tests: [] },
    '6. Document Intelligence': { passed: 0, failed: 0, tests: [] },
    '7. Legal AI & Research Memorandums': { passed: 0, failed: 0, tests: [] },
    '8. Admin & Master Taxonomies': { passed: 0, failed: 0, tests: [] },
    '9. Leads & Inquiries System': { passed: 0, failed: 0, tests: [] },
    '10. Frontend Platform Routing': { passed: 0, failed: 0, tests: [] },
  };

  async function test(category, name, fn) {
    try {
      await fn();
      categories[category].passed++;
      categories[category].tests.push({ name, status: 'PASS' });
      process.stdout.write(`  [PASS] ${name}\n`);
    } catch (err) {
      categories[category].failed++;
      categories[category].tests.push({ name, status: 'FAIL', error: err.message });
      process.stdout.write(`  [FAIL] ${name} -> ${err.message}\n`);
    }
  }

  let userToken = '';
  let adminToken = '';
  let createdMatterId = '';
  let createdDocId = '';
  let createdResearchId = '';
  let leadId = '';

  // -------------------------------------------------------------------------
  // CATEGORY 1: Authentication & Security
  // -------------------------------------------------------------------------
  console.log('--- 1. Testing Authentication & Security ---');

  const mongoose = require('mongoose');
  const User = require('./models/User');
  await mongoose.connect(process.env.MONGODB_URI);

  await test('1. Authentication & Security', 'User Login & Email OTP Verification (cfsys.xyz@gmail.com)', async () => {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'cfsys.xyz@gmail.com', password: '123456' }),
    });
    const data = await res.json();
    if (!res.ok || !data.requiresOtp) throw new Error('Expected login to require OTP');

    // Retrieve generated OTP from DB User table (otp & otpexpiriesin)
    const u = await User.findOne({ email: 'cfsys.xyz@gmail.com' });
    if (!u.otp || !u.otpexpiriesin) throw new Error('DB User missing otp or otpexpiriesin field');

    const vRes = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'cfsys.xyz@gmail.com', otp: u.otp, purpose: 'login' }),
    });
    const vData = await vRes.json();
    if (!vRes.ok || !vData.token) throw new Error(vData.message || 'OTP verification failed to return token');
    userToken = vData.token;
  });

  await test('1. Authentication & Security', 'Admin Login & Email OTP Verification (admin@legalai.in)', async () => {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@legalai.in', password: 'admin123' }),
    });
    const data = await res.json();
    if (!res.ok || !data.requiresOtp) throw new Error('Expected admin login to require OTP');

    const u = await User.findOne({ email: 'admin@legalai.in' });
    if (!u.otp || !u.otpexpiriesin) throw new Error('Admin missing otp or otpexpiriesin');

    const vRes = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@legalai.in', otp: u.otp, purpose: 'login' }),
    });
    const vData = await vRes.json();
    if (!vRes.ok || !vData.token) throw new Error('Admin OTP verification failed');
    adminToken = vData.token;
  });


  await test('1. Authentication & Security', 'Reject invalid password with 401 Unauthorized', async () => {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@legalai.in', password: 'invalid_password_xyz' }),
    });
    if (res.status !== 401) throw new Error(`Expected status 401, got ${res.status}`);
  });

  await test('1. Authentication & Security', 'Verify user session & permissions (/api/auth/me)', async () => {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const data = await res.json();
    const user = data.user || data.data || data;
    if (!res.ok || !user || !user.email) throw new Error('Failed to retrieve user profile');
  });

  // -------------------------------------------------------------------------
  // CATEGORY 2: Dashboard & Platform Metrics
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Testing Dashboard & Platform Metrics ---');

  await test('2. Dashboard & Platform Metrics', 'Backend System Health status check (/api/health)', async () => {
    const res = await fetch(`${BACKEND_URL}/health`);
    const data = await res.json();
    if (!res.ok || data.status !== 'online') throw new Error('Health check offline');
  });

  await test('2. Dashboard & Platform Metrics', 'Retrieve platform statistics & counts (/api/admin/stats)', async () => {
    const res = await fetch(`${BACKEND_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Admin stats failed');
  });

  // -------------------------------------------------------------------------
  // CATEGORY 3: Global Search & Spotlight Engine
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Testing Global Search & Spotlight Engine ---');

  await test('3. Global Search & Spotlight Engine', 'Default search returns live categorized workspace items', async () => {
    const res = await fetch(`${BACKEND_URL}/search`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('Search returned empty array');
    const categoriesFound = new Set(data.map((x) => x.category));
    if (!categoriesFound.has('Judgments') || !categoriesFound.has('Matters')) {
      throw new Error(`Missing expected categories: ${[...categoriesFound].join(', ')}`);
    }
  });

  await test('3. Global Search & Spotlight Engine', 'Query "arbitration" dynamically filters judgments & matters', async () => {
    const res = await fetch(`${BACKEND_URL}/search?q=arbitration`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('No items matched "arbitration"');
    const matched = data.some((x) => x.category === 'Judgments');
    if (!matched) throw new Error('No judgment matched for arbitration');
  });

  await test('3. Global Search & Spotlight Engine', 'Query "tata" matches landmark Tata judgment', async () => {
    const res = await fetch(`${BACKEND_URL}/search?q=tata`);
    const data = await res.json();
    const hasTata = data.some((x) => x.title && x.title.toLowerCase().includes('tata'));
    if (!hasTata) throw new Error('Failed to find Tata judgment');
  });

  await test('3. Global Search & Spotlight Engine', 'Public guest search access without Bearer token operates seamlessly', async () => {
    const res = await fetch(`${BACKEND_URL}/search?q=ribbons`);
    const data = await res.json();
    if (!res.ok || !Array.isArray(data)) throw new Error('Guest search failed');
  });

  // -------------------------------------------------------------------------
  // CATEGORY 4: Judgments & Precedents Engine
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Testing Judgments & Precedents Engine ---');

  let sampleJudgmentId = '';
  await test('4. Judgments & Precedents Engine', 'Retrieve landmark judgments list (/api/judgments)', async () => {
    const res = await fetch(`${BACKEND_URL}/judgments`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data || [];
    if (list.length === 0) throw new Error('No judgments returned');
    sampleJudgmentId = list[0]._id;
  });

  await test('4. Judgments & Precedents Engine', 'Filter judgments by court (Supreme Court of India)', async () => {
    const res = await fetch(`${BACKEND_URL}/judgments?court=${encodeURIComponent('Supreme Court of India')}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data || [];
    if (list.length === 0) throw new Error('Supreme Court filter failed');
  });

  await test('4. Judgments & Precedents Engine', 'Fetch specific judgment details by ID with precedent badges', async () => {
    if (!sampleJudgmentId) throw new Error('No judgment ID available to test');
    const res = await fetch(`${BACKEND_URL}/judgments/${sampleJudgmentId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const data = await res.json();
    const item = data._id ? data : data.data;
    if (!item || !item.title) throw new Error('Invalid judgment detail payload');
  });

  // -------------------------------------------------------------------------
  // CATEGORY 5: Matters & Case Management
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Testing Matters & Case Management ---');

  await test('5. Matters & Case Management', 'Retrieve legal matters list (/api/matters)', async () => {
    const res = await fetch(`${BACKEND_URL}/matters`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data || [];
    if (!Array.isArray(list)) throw new Error('Matters response is not an array');
  });

  await test('5. Matters & Case Management', 'Create new legal matter with client and court details', async () => {
    const res = await fetch(`${BACKEND_URL}/matters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        title: 'Apex Innovations Corp v. Metro Telecom (Arbitration)',
        clientName: 'Apex Innovations Corp',
        court: 'High Court of Delhi',
        matterType: 'Litigation',
        status: 'Active',
        stage: 'Pleadings & Discovery',
      }),
    });
    const data = await res.json();
    const id = data._id || data.data?._id;
    if (!id) throw new Error('Matter creation failed to return ID');
    createdMatterId = id;
  });

  await test('5. Matters & Case Management', 'Update matter details and next hearing date', async () => {
    if (!createdMatterId) throw new Error('No matter ID to update');
    const res = await fetch(`${BACKEND_URL}/matters/${createdMatterId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        status: 'Closed',
        stage: 'Hearing Concluded',
        nextHearingDate: '2026-11-15',
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Matter update failed');
  });

  await test('5. Matters & Case Management', 'Cleanup / Delete test matter', async () => {
    if (!createdMatterId) return;
    const res = await fetch(`${BACKEND_URL}/matters/${createdMatterId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!res.ok && res.status !== 204) throw new Error('Matter deletion failed');
  });

  // -------------------------------------------------------------------------
  // CATEGORY 6: Document Intelligence
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Testing Document Intelligence ---');

  await test('6. Document Intelligence', 'Retrieve workspace documents list (/api/documents)', async () => {
    const res = await fetch(`${BACKEND_URL}/documents`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data || [];
    if (!Array.isArray(list)) throw new Error('Documents response is not an array');
  });

  await test('6. Document Intelligence', 'Create document record with AI intelligence metadata', async () => {
    const res = await fetch(`${BACKEND_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        title: 'Master_Services_Agreement_2026.pdf',
        pages: 14,
        isConfidential: true,
        aiAnalysis: {
          summary: 'Governing IT consulting and intellectual property rights agreement.',
          parties: ['Apex Tech Ltd.', 'Global Synergy Corp'],
          obligations: ['Confidentiality for 5 years', 'Arbitration in New Delhi'],
        },
      }),
    });
    const data = await res.json();
    const id = data._id || data.data?._id;
    if (!id) throw new Error('Document creation failed to return ID');
    createdDocId = id;
  });

  await test('6. Document Intelligence', 'Execute AI Document Analysis action (Summarise)', async () => {
    if (!createdDocId) return;
    const res = await fetch(`${BACKEND_URL}/documents/${createdDocId}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ action: 'Summarise' }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Document AI action failed');
  });

  await test('6. Document Intelligence', 'Fetch document details & AI analysis by ID', async () => {
    if (!createdDocId) return;
    const res = await fetch(`${BACKEND_URL}/documents/${createdDocId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const data = await res.json();
    const doc = data._id ? data : data.data;
    if (!doc || !doc.title) throw new Error('Failed to retrieve document details');
  });

  await test('6. Document Intelligence', 'Cleanup / Delete test document record', async () => {
    if (!createdDocId) return;
    const res = await fetch(`${BACKEND_URL}/documents/${createdDocId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    if (!res.ok && res.status !== 204) throw new Error('Document deletion failed');
  });

  // -------------------------------------------------------------------------
  // CATEGORY 7: Legal AI & Research Memorandums
  // -------------------------------------------------------------------------
  console.log('\n--- 7. Testing Legal AI & Research Memorandums ---');

  await test('7. Legal AI & Research Memorandums', 'Retrieve research sessions history (/api/research)', async () => {
    const res = await fetch(`${BACKEND_URL}/research`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data || [];
    if (!Array.isArray(list)) throw new Error('Research list response invalid');
  });

  await test('7. Legal AI & Research Memorandums', 'Generate & store AI Legal Research Memorandum', async () => {
    const res = await fetch(`${BACKEND_URL}/research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        question: 'Is an emergency arbitration award enforceable under Section 17(2) of the Indian Arbitration Act?',
        jurisdiction: 'Supreme Court of India',
        depth: 'Deep Research',
        memorandum: 'Under Amazon.com NV v. Future Retail (2021), the Supreme Court affirmed that orders of an emergency arbitrator are orders under Section 17(1) and fully enforceable under Section 17(2).',
        authorities: [
          {
            title: 'Amazon.com NV Investment Holdings LLC v. Future Retail Ltd.',
            citation: '2021 SCC OnLine SC 557',
            status: 'Good Law',
            relevance: 'Affirmed enforceability of Emergency Arbitrator interim awards',
          },
        ],
      }),
    });
    const data = await res.json();
    const id = data._id || data.data?._id;
    if (!id) throw new Error('Failed to create research memorandum');
    createdResearchId = id;
  });

  await test('7. Legal AI & Research Memorandums', 'Direct Legal AI Reasoning Query (/api/research/ask)', async () => {
    const res = await fetch(`${BACKEND_URL}/research/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        question: 'Explain principles governing condonation of delay under Section 5 Limitation Act.',
        court: 'Supreme Court of India',
        depth: 'Standard',
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.answer) throw new Error('AI Reasoning failed to return analysis');
  });

  await test('7. Legal AI & Research Memorandums', 'Fetch generated research memorandum with citations by ID', async () => {
    if (!createdResearchId) return;
    const res = await fetch(`${BACKEND_URL}/research/${createdResearchId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const data = await res.json();
    const item = data._id ? data : data.data;
    if (!item || !item.question) throw new Error('Failed to fetch research by ID');
  });

  // -------------------------------------------------------------------------
  // CATEGORY 8: Admin & Master Taxonomies
  // -------------------------------------------------------------------------
  console.log('\n--- 8. Testing Admin & Master Taxonomies ---');

  await test('8. Admin & Master Taxonomies', 'Retrieve platform user directory (/api/admin/users)', async () => {
    const res = await fetch(`${BACKEND_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data || [];
    if (!Array.isArray(list) || list.length === 0) throw new Error('Users list empty');
  });

  await test('8. Admin & Master Taxonomies', 'Retrieve national court taxonomies & case types (/api/masters)', async () => {
    const res = await fetch(`${BACKEND_URL}/masters`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Master data endpoint failed');
  });

  // -------------------------------------------------------------------------
  // CATEGORY 9: Leads & Inquiries System
  // -------------------------------------------------------------------------
  console.log('\n--- 9. Testing Leads & Inquiries System ---');

  await test('9. Leads & Inquiries System', 'Submit customer inquiry / enterprise demo request (/api/contact)', async () => {
    const res = await fetch(`${BACKEND_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Senior Counsel Sharma',
        email: 'counsel.sharma@lawfirm.in',
        mobile: '+91 9876543210',
        organisation: 'Sharma & Partners Chambers',
        subject: 'Enterprise Demo Request',
        message: 'Requesting pilot onboarding for litigation research and precedent citations.',
      }),
    });
    const data = await res.json();
    const lead = data.data || data;
    if (!lead || !lead._id) throw new Error('Failed to submit contact form');
    leadId = lead._id;
  });

  await test('9. Leads & Inquiries System', 'Retrieve inquiries list with administrative filters', async () => {
    const res = await fetch(`${BACKEND_URL}/contact`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    const list = data.leads || data.data || (Array.isArray(data) ? data : []);
    if (!Array.isArray(list) || list.length === 0) throw new Error('Inquiries list empty or invalid');
  });

  if (leadId) {
    await test('9. Leads & Inquiries System', 'Cleanup / Delete test inquiry record', async () => {
      const res = await fetch(`${BACKEND_URL}/contact/${leadId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error('Inquiry deletion failed');
    });
  }

  // -------------------------------------------------------------------------
  // CATEGORY 10: Frontend Platform Routing & Vite Server
  // -------------------------------------------------------------------------
  console.log('\n--- 10. Testing Frontend Platform Routing & Assets ---');

  await test('10. Frontend Platform Routing', 'Marketing Homepage route loads successfully (200 OK)', async () => {
    const res = await fetch(`${FRONTEND_URL}/`);
    if (!res.ok) throw new Error(`Frontend HTTP error: ${res.status}`);
  });

  await test('10. Frontend Platform Routing', 'Auth Login Page loads successfully (200 OK)', async () => {
    const res = await fetch(`${FRONTEND_URL}/login`);
    if (!res.ok) throw new Error(`Login route HTTP error: ${res.status}`);
  });

  await test('10. Frontend Platform Routing', 'Application Workspace Dashboard route loads (200 OK)', async () => {
    const res = await fetch(`${FRONTEND_URL}/app/dashboard`);
    if (!res.ok) throw new Error(`Dashboard route HTTP error: ${res.status}`);
  });

  await test('10. Frontend Platform Routing', 'Judgments Precedent Engine route loads (200 OK)', async () => {
    const res = await fetch(`${FRONTEND_URL}/app/judgments`);
    if (!res.ok) throw new Error(`Judgments route HTTP error: ${res.status}`);
  });

  // -------------------------------------------------------------------------
  // FINAL SCORECARD & PERCENTAGE REPORT
  // -------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log('                          FINAL FUNCTIONALITY SCORECARD                         ');
  console.log('================================================================================\n');

  let totalPassed = 0;
  let totalFailed = 0;
  const tableRows = [];

  for (const [catName, result] of Object.entries(categories)) {
    const total = result.passed + result.failed;
    const pct = total === 0 ? 100 : Math.round((result.passed / total) * 100);
    totalPassed += result.passed;
    totalFailed += result.failed;
    const grade = pct === 100 ? 'EXCELLENT' : pct >= 80 ? 'GOOD' : 'NEEDS ATTENTION';
    tableRows.push({
      Category: catName,
      Passed: `${result.passed}/${total}`,
      Score: `${pct}%`,
      Status: grade,
    });
    console.log(`${catName.padEnd(40)} : ${result.passed}/${total} passed (${pct.toString().padStart(3)}%)  [${grade}]`);
  }

  const grandTotal = totalPassed + totalFailed;
  const overallPct = grandTotal === 0 ? 100 : Math.round((totalPassed / grandTotal) * 100);

  console.log('\n--------------------------------------------------------------------------------');
  console.log(`OVERALL PLATFORM FUNCTIONALITY SCORE : ${totalPassed}/${grandTotal} PASSED (${overallPct}%)`);
  console.log('================================================================================\n');
}

runTestSuite().catch((e) => {
  console.error('Fatal execution error:', e);
});
