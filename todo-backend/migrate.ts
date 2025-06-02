#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Task } from './src/models/Task';

dotenv.config();

async function runMigrations() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    console.log('🚀 Running database migrations...');

    // Create indexes for better performance
    console.log('📊 Creating indexes...');

    // Index for sorting by creation date (most common query)
    await Task.collection.createIndex({ createdAt: -1 });
    console.log('✅ Created index on createdAt (descending)');

    // Index for filtering by completion status
    await Task.collection.createIndex({ completed: 1 });
    console.log('✅ Created index on completed');

    // Compound index for filtering and sorting
    await Task.collection.createIndex({ completed: 1, createdAt: -1 });
    console.log('✅ Created compound index on completed + createdAt');

    // Text search index for title
    await Task.collection.createIndex({ title: 'text' });
    console.log('✅ Created text index on title for search');

    // Check database stats
    console.log('\n📊 Database Statistics:');
    const stats = await mongoose.connection.db?.stats();
    if (stats) {
      console.log(`📁 Database: ${mongoose.connection.db?.databaseName}`);
      console.log(`📊 Collections: ${stats.collections}`);
      console.log(`💾 Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`🗂️ Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
    }

    // Check collections
    console.log('\n📋 Collections:');
    const collections = await mongoose.connection.db?.listCollections().toArray();
    collections?.forEach(collection => {
      console.log(`  📁 ${collection.name}`);
    });

    // Check task statistics
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const pendingTasks = await Task.countDocuments({ completed: false });

    console.log('\n📝 Task Statistics:');
    console.log(`📊 Total tasks: ${totalTasks}`);
    console.log(`✅ Completed: ${completedTasks}`);
    console.log(`⏳ Pending: ${pendingTasks}`);
    console.log(`📈 Completion rate: ${totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0}%`);

    console.log('\n🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run migrations
runMigrations();
