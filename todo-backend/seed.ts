import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Task } from './src/models/Task';

dotenv.config();

const seedData = [
  {
    title: "Học React và TypeScript",
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Xây dựng backend với Node.js",
    completed: true,
    createdAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    title: "Tích hợp MongoDB Atlas",
    completed: false,
    createdAt: new Date(Date.now() - 43200000) // 12 hours ago
  },
  {
    title: "Thiết kế UI với Tailwind CSS",
    completed: true,
    createdAt: new Date(Date.now() - 21600000) // 6 hours ago
  },
  {
    title: "Deploy ứng dụng lên production",
    completed: false,
    createdAt: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    title: "Viết unit tests",
    completed: false,
    createdAt: new Date(Date.now() - 1800000) // 30 minutes ago
  },
  {
    title: "Tối ưu hóa performance",
    completed: false,
    createdAt: new Date(Date.now() - 900000) // 15 minutes ago
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing tasks...');
    await Task.deleteMany({});

    // Insert seed data
    console.log('📝 Inserting seed data...');
    const insertedTasks = await Task.insertMany(seedData);
    console.log(`✅ Inserted ${insertedTasks.length} tasks`);

    // Create indexes for better performance
    console.log('📊 Creating indexes...');
    await Task.collection.createIndex({ createdAt: -1 });
    await Task.collection.createIndex({ completed: 1 });
    console.log('✅ Indexes created');

    // Display statistics
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const pendingTasks = await Task.countDocuments({ completed: false });

    console.log('\n=== Database Statistics ===');
    console.log(`📊 Total tasks: ${totalTasks}`);
    console.log(`✅ Completed tasks: ${completedTasks}`);
    console.log(`⏳ Pending tasks: ${pendingTasks}`);

    console.log('\n🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit();
  }
}

// Run the seeder
seedDatabase();
