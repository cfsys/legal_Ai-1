const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: 'c:\\Users\\PRENEEL\\Desktop\\legal_Ai Admin\\backend\\.env' });

async function cleanAllExceptSuperAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to Atlas MongoDB');

  const subadminsCol = mongoose.connection.db.collection('subadmins');
  const usersCol = mongoose.connection.db.collection('users');

  // 1. Find all subadmins
  const allSubAdmins = await subadminsCol.find().toArray();
  console.log('Found existing subadmins:', allSubAdmins.map(a => a.username || a.email));

  // 2. Remove all accounts where username is not superadmin and email is not cfsys.xyz@gmail.com
  const deleteResult = await subadminsCol.deleteMany({
    username: { $nin: ['superadmin', 'chirag_poshiya'] },
    email: { $nin: ['admin@themes.ai', 'cfsys.xyz@gmail.com', 'superadmin@legalai.in'] }
  });
  console.log(`Deleted ${deleteResult.deletedCount} non-superadmin accounts.`);

  // 3. Ensure superadmin exists with full unrestricted permissions across all modules
  const fullModulePermissions = {
    matters: { read: true, create: true, edit: true, delete: true },
    documents: { read: true, create: true, edit: true, delete: true },
    contracts: { read: true, create: true, edit: true, delete: true },
    drafting: { read: true, create: true, edit: true, delete: true },
    research: { read: true, create: true, edit: true, delete: true },
    judgments: { read: true, create: true, edit: true, delete: true },
    ai: { read: true, create: true, edit: true, delete: true },
    tasks: { read: true, create: true, edit: true, delete: true },
    calendar: { read: true, create: true, edit: true, delete: true },
    templates: { read: true, create: true, edit: true, delete: true },
    reports: { read: true, create: true, edit: true, delete: true },
    masters: { read: true, create: true, edit: true, delete: true },
    users: { read: true, create: true, edit: true, delete: true },
    organisation: { read: true, create: true, edit: true, delete: true },
    subscriptions: { read: true, create: true, edit: true, delete: true },
    usage: { read: true, create: true, edit: true, delete: true },
    audit: { read: true, create: true, edit: true, delete: true },
  };

  // Upsert superadmin
  await subadminsCol.updateOne(
    { username: 'superadmin' },
    {
      $set: {
        username: 'superadmin',
        fullName: 'Super Administrator',
        email: 'admin@themes.ai',
        role: 'Super Admin',
        roleTitle: 'Super Admin',
        code: 'SUPER_ADM',
        deviceLimit: 'Unlimited',
        salesPerson: 'No',
        status: 1,
        permissions: {
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
          modules: fullModulePermissions,
        },
        assignedBy: 'System',
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  );
  console.log('Super Admin (admin@themes.ai) verified & updated.');

  // Also ensure cfsys.xyz@gmail.com is configured as Super Admin
  await subadminsCol.updateOne(
    { email: 'cfsys.xyz@gmail.com' },
    {
      $set: {
        username: 'chirag_poshiya',
        fullName: 'Chirag Poshiya',
        email: 'cfsys.xyz@gmail.com',
        role: 'Super Admin',
        roleTitle: 'Super Admin',
        code: 'SUPER_ADM',
        deviceLimit: 'Unlimited',
        salesPerson: 'No',
        status: 1,
        permissions: {
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
          modules: fullModulePermissions,
        },
        assignedBy: 'System',
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  );
  console.log('Diya Shah (cfsys.xyz@gmail.com) verified as Super Admin.');

  // Also update users collection: set role: 1 (Super Admin) and permissions: 1023
  await usersCol.updateOne(
    { email: 'cfsys.xyz@gmail.com' },
    { $set: { role: 1, permissions: 1023, plan: 'Enterprise', organisationName: 'Themes AI Legal' } }
  );
  await usersCol.updateOne(
    { email: 'admin@themes.ai' },
    { $set: { role: 1, permissions: 1023, plan: 'Enterprise', organisationName: 'Themes AI Legal' } }
  );

  const remaining = await subadminsCol.find().toArray();
  console.log('\nFINAL ACTIVE SUBADMINS IN ATLAS:');
  remaining.forEach(a => console.log(`- ${a.username} (${a.email}) => role: ${a.role}`));

  await mongoose.disconnect();
}

cleanAllExceptSuperAdmin().catch(console.error);
