// MongoDB Playground for Todo App
// Use: 1. Select your database. 2. Run playground.

// Database name
const database = 'todoapp';

// Collection name
const collection = 'tasks';

// Connect to database
use(database);

// 1. Insert sample tasks
db[collection].insertMany([
  {
    title: "Hoàn thành setup database",
    completed: true,
    priority: "high",
    description: "Setup MongoDB Atlas và tạo schema cho ứng dụng Todo",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Thiết kế UI components",
    completed: false,
    priority: "medium",
    description: "Tạo các React components với Tailwind CSS",
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000)
  },
  {
    title: "Implement API endpoints",
    completed: false,
    priority: "high",
    description: "Tạo CRUD endpoints cho tasks",
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    updatedAt: new Date(Date.now() - 7200000)
  },
  {
    title: "Deploy ứng dụng",
    completed: false,
    priority: "low",
    description: "Deploy lên Heroku hoặc Vercel",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000)
  }
]);

// 2. Query all tasks
console.log("=== All Tasks ===");
db[collection].find({}).sort({ createdAt: -1 }).pretty();

// 3. Query pending tasks
console.log("=== Pending Tasks ===");
db[collection].find({ completed: false }).sort({ createdAt: -1 }).pretty();

// 4. Query completed tasks
console.log("=== Completed Tasks ===");
db[collection].find({ completed: true }).sort({ createdAt: -1 }).pretty();

// 5. Query by priority
console.log("=== High Priority Tasks ===");
db[collection].find({ priority: "high" }).sort({ createdAt: -1 }).pretty();

// 6. Update a task
db[collection].updateOne(
  { title: "Thiết kế UI components" },
  {
    $set: {
      completed: true,
      updatedAt: new Date()
    }
  }
);

// 7. Statistics
console.log("=== Statistics ===");
const totalTasks = db[collection].countDocuments({});
const completedTasks = db[collection].countDocuments({ completed: true });
const pendingTasks = db[collection].countDocuments({ completed: false });

console.log(`Total tasks: ${totalTasks}`);
console.log(`Completed tasks: ${completedTasks}`);
console.log(`Pending tasks: ${pendingTasks}`);
console.log(`Completion rate: ${((completedTasks / totalTasks) * 100).toFixed(1)}%`);

// 8. Tasks by priority
console.log("=== Tasks by Priority ===");
db[collection].aggregate([
  {
    $group: {
      _id: "$priority",
      count: { $sum: 1 },
      completed: {
        $sum: {
          $cond: ["$completed", 1, 0]
        }
      }
    }
  },
  {
    $sort: { _id: 1 }
  }
]).pretty();

// 9. Create indexes for performance
db[collection].createIndex({ createdAt: -1 });
db[collection].createIndex({ completed: 1 });
db[collection].createIndex({ priority: 1 });
db[collection].createIndex({ title: "text" });

// 10. Show indexes
console.log("=== Indexes ===");
db[collection].getIndexes();

// 11. Text search example
console.log("=== Text Search Results ===");
db[collection].find(
  { $text: { $search: "UI design" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } }).pretty();

// 12. Recent tasks (last 24 hours)
console.log("=== Recent Tasks (Last 24 hours) ===");
const yesterday = new Date(Date.now() - 86400000);
db[collection].find({
  createdAt: { $gte: yesterday }
}).sort({ createdAt: -1 }).pretty();

// 13. Bulk operations example
// Mark multiple tasks as completed
db[collection].updateMany(
  { priority: "low", completed: false },
  {
    $set: {
      completed: true,
      updatedAt: new Date()
    }
  }
);

// 14. Find and modify example
const updatedTask = db[collection].findOneAndUpdate(
  { title: "Deploy ứng dụng" },
  {
    $set: {
      priority: "medium",
      updatedAt: new Date()
    }
  },
  { returnNewDocument: true }
);

console.log("=== Updated Task ===");
console.log(updatedTask);

// 15. Clean up - Remove all test data (uncomment to use)
// db[collection].deleteMany({});
// console.log("Test data cleaned up");
