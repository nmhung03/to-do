#!/usr/bin/env node

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Task } from './src/models/Task';

dotenv.config();

const BACKUP_DIR = path.join(__dirname, 'backups');

async function createBackup() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    // Ensure backup directory exists
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Get all tasks
    console.log('📤 Exporting tasks...');
    const tasks = await Task.find({}).sort({ createdAt: -1 });

    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `tasks-backup-${timestamp}.json`);

    // Write backup file
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      totalTasks: tasks.length,
      tasks: tasks
    };

    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));

    console.log(`✅ Backup created successfully!`);
    console.log(`📁 File: ${backupFile}`);
    console.log(`📊 Total tasks backed up: ${tasks.length}`);

  } catch (error) {
    console.error('❌ Backup failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit();
  }
}

async function restoreBackup(backupFileName: string) {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    const backupFile = path.join(BACKUP_DIR, backupFileName);

    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    console.log(`📤 Reading backup file: ${backupFileName}`);
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

    console.log('🗑️ Clearing existing tasks...');
    await Task.deleteMany({});

    console.log('📥 Restoring tasks...');
    await Task.insertMany(backupData.tasks);

    console.log(`✅ Restore completed successfully!`);
    console.log(`📊 Tasks restored: ${backupData.totalTasks}`);
    console.log(`🕐 Backup created: ${backupData.timestamp}`);

  } catch (error) {
    console.error('❌ Restore failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit();
  }
}

function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('📁 No backup directory found');
    return;
  }

  const files = fs.readdirSync(BACKUP_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const stats = fs.statSync(path.join(BACKUP_DIR, file));
      return {
        name: file,
        size: stats.size,
        created: stats.birthtime
      };
    })
    .sort((a, b) => b.created.getTime() - a.created.getTime());

  if (files.length === 0) {
    console.log('📁 No backup files found');
    return;
  }

  console.log('📋 Available backups:');
  files.forEach((file, index) => {
    const sizeKB = (file.size / 1024).toFixed(2);
    console.log(`${index + 1}. ${file.name} (${sizeKB} KB) - ${file.created.toLocaleString()}`);
  });
}

// Command line interface
const command = process.argv[2];
const fileName = process.argv[3];

switch (command) {
  case 'backup':
    createBackup();
    break;
  case 'restore':
    if (!fileName) {
      console.error('❌ Please provide backup filename');
      console.log('Usage: npm run backup:restore <backup-filename>');
      process.exit(1);
    }
    restoreBackup(fileName);
    break;
  case 'list':
    listBackups();
    break;
  default:
    console.log('📋 Database Backup/Restore Tool');
    console.log('');
    console.log('Available commands:');
    console.log('  npm run backup:create  - Create a new backup');
    console.log('  npm run backup:restore <filename> - Restore from backup');
    console.log('  npm run backup:list    - List available backups');
    process.exit(1);
}
