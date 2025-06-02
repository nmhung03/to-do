/* global use, db */
// MongoDB Playground for Todo App Database Setup
// This script creates the todo database with sample data

// Select the database to use
use('todoapp');

// Drop existing tasks collection if it exists (for clean setup)
db.tasks.drop();

// Create tasks collection with sample data
db.tasks.insertMany([
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
  }
]);

// Create index for better performance
db.tasks.createIndex({ "createdAt": -1 });
db.tasks.createIndex({ "completed": 1 });

// Display all tasks
console.log("=== All Tasks ===");
db.tasks.find().sort({ createdAt: -1 });

// Display statistics
const totalTasks = db.tasks.countDocuments();
const completedTasks = db.tasks.countDocuments({ completed: true });
const pendingTasks = db.tasks.countDocuments({ completed: false });

console.log("=== Task Statistics ===");
console.log(`Total tasks: ${totalTasks}`);
console.log(`Completed tasks: ${completedTasks}`);
console.log(`Pending tasks: ${pendingTasks}`);
db.getCollection('sales').insertMany([
  { 'item': 'abc', 'price': 10, 'quantity': 2, 'date': new Date('2014-03-01T08:00:00Z') },
  { 'item': 'jkl', 'price': 20, 'quantity': 1, 'date': new Date('2014-03-01T09:00:00Z') },
  { 'item': 'xyz', 'price': 5, 'quantity': 10, 'date': new Date('2014-03-15T09:00:00Z') },
  { 'item': 'xyz', 'price': 5, 'quantity': 20, 'date': new Date('2014-04-04T11:21:39.736Z') },
  { 'item': 'abc', 'price': 10, 'quantity': 10, 'date': new Date('2014-04-04T21:23:13.331Z') },
  { 'item': 'def', 'price': 7.5, 'quantity': 5, 'date': new Date('2015-06-04T05:08:13Z') },
  { 'item': 'def', 'price': 7.5, 'quantity': 10, 'date': new Date('2015-09-10T08:43:00Z') },
  { 'item': 'abc', 'price': 10, 'quantity': 5, 'date': new Date('2016-02-06T20:20:13Z') },
]);

// Run a find command to view items sold on April 4th, 2014.
const salesOnApril4th = db.getCollection('sales').find({
  date: { $gte: new Date('2014-04-04'), $lt: new Date('2014-04-05') }
}).count();

// Print a message to the output window.
console.log(`${salesOnApril4th} sales occurred in 2014.`);

// Here we run an aggregation and open a cursor to the results.
// Use '.toArray()' to exhaust the cursor to return the whole result set.
// You can use '.hasNext()/.next()' to iterate through the cursor page by page.
db.getCollection('sales').aggregate([
  // Find all of the sales that occurred in 2014.
  { $match: { date: { $gte: new Date('2014-01-01'), $lt: new Date('2015-01-01') } } },
  // Group the total sales for each product.
  { $group: { _id: '$item', totalSaleAmount: { $sum: { $multiply: [ '$price', '$quantity' ] } } } }
]);
