const mongoose = require('mongoose');

const uri = 'mongodb+srv://nmhung03:uejnFD56V9BLbhz0@cluster0.mongodb.net/todoapp?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log('URI:', uri);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('Database:', mongoose.connection.db.databaseName);

    // Test tạo document
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });

    const TestModel = mongoose.model('Test', testSchema);
    const testDoc = new TestModel({ name: 'Connection Test' });
    await testDoc.save();

    console.log('✅ Successfully created test document!');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testConnection();
