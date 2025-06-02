import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🧪 Testing MongoDB Atlas Connection');
  console.log('===================================');

  const connectionStrings = [
    // SRV với family=4 (IPv4 only)
    `mongodb+srv://nmhung03:uejnFD56V9BLbhz0@cluster0.mongodb.net/todoapp?retryWrites=true&w=majority&serverSelectionTimeoutMS=30000&connectTimeoutMS=30000&family=4`,

    // SRV với authSource
    `mongodb+srv://nmhung03:uejnFD56V9BLbhz0@cluster0.mongodb.net/todoapp?retryWrites=true&w=majority&authSource=admin&serverSelectionTimeoutMS=30000&connectTimeoutMS=30000`,

    // Standard connection (cần IP cụ thể từ Atlas)
    `mongodb://cluster0-shard-00-00.mongodb.net:27017,cluster0-shard-00-01.mongodb.net:27017,cluster0-shard-00-02.mongodb.net:27017/todoapp?ssl=true&replicaSet=atlas-default&authSource=admin&retryWrites=true&w=majority`,

    // Local MongoDB (backup)
    `mongodb://localhost:27017/todoapp`
  ];

  for (let i = 0; i < connectionStrings.length; i++) {
    console.log(`\n📝 Test ${i + 1}: ${i === 3 ? 'Local MongoDB' : 'Atlas Connection'}`);
    console.log('🔌 Attempting connection...');

    try {
      await mongoose.connect(connectionStrings[i]);
      console.log('✅ Connection successful!');

      // Test basic operation
      const testSchema = new mongoose.Schema({ test: String });
      const TestModel = mongoose.model('Test', testSchema);

      const doc = new TestModel({ test: 'connection test' });
      await doc.save();
      console.log('✅ Write operation successful!');

      await TestModel.deleteMany({ test: 'connection test' });
      console.log('✅ Delete operation successful!');

      await mongoose.disconnect();
      console.log('✅ All tests passed! Use this connection string.');
      return connectionStrings[i];

    } catch (error: any) {
      console.log(`❌ Connection failed: ${error.message}`);
      try {
        await mongoose.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
    }
  }

  console.log('\n💡 All connections failed. Try these solutions:');
  console.log('1. 🔐 Check IP whitelist in MongoDB Atlas');
  console.log('2. 🌐 Try different network/VPN');
  console.log('3. 📱 Use mobile hotspot');
  console.log('4. 💻 Install MongoDB locally');
  console.log('5. 🔧 Contact MongoDB Atlas support');

  return null;
}

testConnection()
  .then((successfulConnection) => {
    if (successfulConnection) {
      console.log(`\n🎉 Use this connection string in your .env file:`);
      console.log(`MONGODB_URI=${successfulConnection}`);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
