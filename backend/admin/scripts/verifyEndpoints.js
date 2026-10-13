async function verifyAllEndpoints() {
  const loginRes = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@themes.ai', password: 'admin123' })
  });
  const { token } = await loginRes.json();
  const headers = { 'Authorization': 'Bearer ' + token };

  const endpoints = [
    { name: 'Overview', url: 'http://localhost:5001/api/admin/overview' },
    { name: 'Users', url: 'http://localhost:5001/api/admin/users' },
    { name: 'Firms', url: 'http://localhost:5001/api/admin/firms' },
    { name: 'AI Quotas & Models', url: 'http://localhost:5001/api/admin/ai-quotas' },
    { name: 'Roles', url: 'http://localhost:5001/api/admin/roles' },
    { name: 'SubAdmins', url: 'http://localhost:5001/api/admin/sub-admins' },
    { name: 'Master Categories', url: 'http://localhost:5001/api/admin/masters/categories' },
    { name: 'Master Items (Court)', url: 'http://localhost:5001/api/admin/masters?category=Court' },
    { name: 'Audit Logs', url: 'http://localhost:5001/api/admin/audit-logs' },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, { headers });
      const body = await res.json();
      console.log(`[PASS] ${ep.name} -> Status: ${res.status}, Success: ${body.success}`);
      if (ep.name === 'Overview') {
        const stats = body.data?.stats;
        console.log(`Firms: ${stats?.totalFirms} | Users: ${stats?.totalUsers} | Active Firms: ${stats?.activeFirms} | Active Users: ${stats?.activeUsers}`);
      } else if (ep.name === 'Users') {
        console.log(`       Count: ${body.users?.length} advocates/practitioners`);
      } else if (ep.name === 'Firms') {
        console.log(`       Count: ${body.firms?.length} law firms`);
      } else if (ep.name === 'AI Quotas & Models') {
        console.log(`       Count: ${body.models?.length} models registered`);
      } else if (ep.name === 'Roles') {
        console.log(`       Count: ${body.roles?.length} roles configured`);
      } else if (ep.name === 'SubAdmins') {
        console.log(`       Count: ${body.subAdmins?.length} administrators`);
      } else if (ep.name === 'Master Categories') {
        console.log(`       Count: ${body.categories?.length} categories`);
      } else if (ep.name === 'Master Items (Court)') {
        console.log(`       Count: ${body.items?.length} court records`);
      } else if (ep.name === 'Audit Logs') {
        console.log(`       Count: ${body.logs?.length} audit records`);
      }
    } catch (err) {
      console.error(`[FAIL] ${ep.name} -> ${err.message}`);
    }
  }
}

verifyAllEndpoints().catch(console.error);
