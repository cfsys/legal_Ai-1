const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const MasterData = require('../models/MasterData');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const result = await MasterData.deleteMany({
      category: { $regex: /^language/i }
    });
    console.log(`Successfully deleted ${result.deletedCount} Language master record(s).`);

    const remaining = await MasterData.countDocuments({
      category: { $regex: /^language/i }
    });
    console.log(`Remaining Language records: ${remaining}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error deleting Language records:', err);
    process.exit(1);
  }
})();
