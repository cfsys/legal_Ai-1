require('dotenv').config();
const mongoose = require('mongoose');

async function cleanRoles() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to Atlas successfully.');

    const Role = mongoose.model('Role', new mongoose.Schema({
      name: String,
      code: String,
      description: String,
      permissions: Object,
      isSystem: Boolean,
      status: String,
    }, { timestamps: true }));

    // 1. Check all current roles
    const existingRoles = await Role.find({});
    console.log(`Found ${existingRoles.length} roles in database:`);
    existingRoles.forEach(r => console.log(` - [${r.code}] ${r.name} (isSystem: ${r.isSystem})`));

    // 2. Delete all roles that are NOT Super Admin
    const deleteResult = await Role.deleteMany({
      name: { $ne: 'Super Admin' }
    });
    console.log(`Deleted ${deleteResult.deletedCount} non-Super Admin roles.`);

    // 3. Ensure Super Admin role exists with full permissions
    let superAdminRole = await Role.findOne({ name: 'Super Admin' });
    if (!superAdminRole) {
      console.log('Creating Super Admin role...');
      superAdminRole = await Role.create({
        name: 'Super Admin',
        code: 'SUP_ADM',
        description: 'Unrestricted master access with full CRUD privileges across all legal modules.',
        permissions: {
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
          modules: {
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
          },
        },
        isSystem: true,
        status: 'Active',
      });
      console.log('Super Admin role created.');
    } else {
      // Ensure full permissions
      superAdminRole.code = 'SUP_ADM';
      superAdminRole.isSystem = true;
      superAdminRole.permissions = {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        modules: {
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
        },
      };
      await superAdminRole.save();
      console.log('Super Admin role updated with full privileges.');
    }

    // 4. Verify final list of roles
    const remainingRoles = await Role.find({});
    console.log(`\nRemaining roles in Atlas (${remainingRoles.length}):`);
    remainingRoles.forEach(r => console.log(` - [${r.code}] ${r.name} (id: ${r._id})`));

    await mongoose.disconnect();
    console.log('\nAtlas cleanup completed successfully.');
  } catch (error) {
    console.error('Error cleaning roles:', error);
    process.exit(1);
  }
}

cleanRoles();
