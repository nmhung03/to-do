import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

let tasks: Task[] = [
  {
    _id: '1',
    title: 'Learn TypeScript',
    description: 'Complete TypeScript tutorial',
    completed: false,
    priority: 'high',
    dueDate: new Date('2024-02-01'),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    title: 'Build Todo App',
    description: 'Create a full-stack todo application',
    completed: false,
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    title: 'Deploy to Production',
    description: 'Deploy the application to a cloud platform',
    completed: false,
    priority: 'low',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let nextId = 4;

// Routes
app.get('/api/tasks', (req, res) => {
  try {
    console.log('📝 GET /api/tasks - Fetching all tasks');
    res.json(tasks);
  } catch (error) {
    console.error('❌ Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    console.log('📝 POST /api/tasks - Creating new task:', req.body);

    const { title, description, priority = 'medium', dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTask: Task = {
      _id: nextId.toString(),
      title,
      description,
      completed: false,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    tasks.push(newTask);
    nextId++;

    console.log('✅ Task created successfully:', newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('❌ Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log(`📝 PUT /api/tasks/${id} - Updating task:`, updates);

    const taskIndex = tasks.findIndex(task => task._id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    };

    console.log('✅ Task updated successfully:', tasks[taskIndex]);
    res.json(tasks[taskIndex]);
  } catch (error) {
    console.error('❌ Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    console.log(`📝 DELETE /api/tasks/${id} - Deleting task`);

    const taskIndex = tasks.findIndex(task => task._id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);

    console.log('✅ Task deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error('❌ Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Todo API is running with in-memory database',
    timestamp: new Date().toISOString(),
    tasksCount: tasks.length
  });
});

app.listen(PORT, () => {
  console.log('🚀 Todo Backend Server Started');
  console.log('===============================');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`💾 Database: In-Memory (${tasks.length} sample tasks loaded)`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log('📝 Available endpoints:');
  console.log('  GET    /api/tasks     - Get all tasks');
  console.log('  POST   /api/tasks     - Create new task');
  console.log('  PUT    /api/tasks/:id - Update task');
  console.log('  DELETE /api/tasks/:id - Delete task');
  console.log('===============================');
});
