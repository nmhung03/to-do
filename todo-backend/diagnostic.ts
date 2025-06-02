#!/usr/bin/env node

import mongoose from 'mongoose';
import dns from 'dns';
import { promisify } from 'util';

const resolveSrv = promisify(dns.resolveSrv);

// Test các cách kết nối khác nhau
const connectionStrings = [
  // Original SRV
  'mongodb+srv://nmhung03:uejnFD56V9BLbhz0@cluster0.mongodb.net/todoapp?retryWrites=true&w=majority',
  // With Google DNS
  'mongodb+srv://nmhung03:uejnFD56V9BLbhz0@cluster0.mongodb.net/todoapp?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000',
  // Standard connection (không dùng SRV)
  'mongodb://cluster0-shard-00-00.mongodb.net:27017,cluster0-shard-00-01.mongodb.net:27017,cluster0-shard-00-02.mongodb.net:27017/todoapp?ssl=true&replicaSet=atlas-xyz-shard-0&authSource=admin&retryWrites=true&w=majority'
];

async function testDNSResolution() {
  console.log('🔍 Testing DNS resolution...');
  try {
    const srvRecords = await resolveSrv('_mongodb._tcp.cluster0.mongodb.net');
    console.log('✅ SRV records found:', srvRecords);
  } catch (error: any) {
    console.error('❌ DNS SRV resolution failed:', error.message);

    // Try manual DNS servers
    console.log('🔄 Trying different DNS servers...');

    // Google DNS
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    try {
      const srvRecords = await resolveSrv('_mongodb._tcp.cluster0.mongodb.net');
      console.log('✅ SRV records found with Google DNS:', srvRecords);
    } catch (err: any) {
      console.error('❌ Google DNS also failed:', err.message);
    }

    // Cloudflare DNS
    dns.setServers(['1.1.1.1', '1.0.0.1']);
    try {
      const srvRecords = await resolveSrv('_mongodb._tcp.cluster0.mongodb.net');
      console.log('✅ SRV records found with Cloudflare DNS:', srvRecords);
    } catch (err: any) {
      console.error('❌ Cloudflare DNS also failed:', err.message);
    }
  }
}

async function testConnections() {
  console.log('🚀 Testing MongoDB connections...');

  for (let i = 0; i < connectionStrings.length; i++) {
    const uri = connectionStrings[i];
    console.log(`\n📝 Test ${i + 1}: ${uri.includes('srv') ? 'SRV connection' : 'Standard connection'}`);

    try {
      console.log('🔌 Attempting connection...');
      const options = {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Force IPv4
        maxPoolSize: 1,
        retryWrites: true,
        writeConcern: { w: 'majority' as const }
      };

      await mongoose.connect(uri, options);

      console.log('✅ Connection successful!');
      console.log('📊 Database:', mongoose.connection.db?.databaseName);
      console.log('🏠 Host:', mongoose.connection.host);
      console.log('🔌 Port:', mongoose.connection.port);
      console.log('📡 Ready state:', mongoose.connection.readyState);

      // Test basic operation
      const testCollection = mongoose.connection.db?.collection('connection_test');
      if (testCollection) {
        await testCollection.insertOne({
          test: true,
          timestamp: new Date(),
          connection_type: uri.includes('srv') ? 'SRV' : 'Standard'
        });
        console.log('✅ Test document inserted successfully');

        await testCollection.deleteOne({ test: true });
        console.log('✅ Test document deleted successfully');
      }

      await mongoose.disconnect();
      console.log('✅ Disconnected successfully');

      // If we get here, this connection works
      console.log('🎉 This connection string works! Use this one.');
      break;
    } catch (error: any) {
      console.error('❌ Connection failed:', error.message);

      if (mongoose.connection.readyState !== 0) {
        try {
          await mongoose.disconnect();
        } catch (disconnectError: any) {
          console.error('❌ Error during disconnect:', disconnectError.message);
        }
      }

      continue;
    }
  }
}

async function generateAlternativeConnectionStrings() {
  console.log('\n🔧 Alternative connection methods:');

  console.log(`
1. 📝 Copy this connection string to your .env file:
   MONGODB_URI=mongodb+srv://nmhung03:uejnFD56V9BLbhz0@cluster0.mongodb.net/todoapp?retryWrites=true&w=majority&serverSelectionTimeoutMS=10000&connectTimeoutMS=10000

2. 🌐 If SRV doesn't work, try getting the exact connection string from MongoDB Atlas:
   - Go to https://cloud.mongodb.com
   - Select your cluster
   - Click "Connect" > "Connect your application"
   - Copy the connection string

3. 🔧 Alternative DNS settings (run in Command Prompt as Administrator):
   netsh interface ip set dns "Wi-Fi" static 8.8.8.8
   netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2

4. 🖥️ Use MongoDB Compass to test connection:
   - Download MongoDB Compass
   - Use the same connection string
   - Test if it connects

5. 💻 Local MongoDB alternative:
   - Install MongoDB locally
   - Use: mongodb://localhost:27017/todoapp
  `);
}

async function main() {
  console.log('🧪 MongoDB Connection Diagnostics');
  console.log('==================================\n');

  await testDNSResolution();
  await testConnections();
  await generateAlternativeConnectionStrings();

  console.log('\n✨ Diagnostic completed!');
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Diagnostic failed:', error);
  process.exit(1);
});
