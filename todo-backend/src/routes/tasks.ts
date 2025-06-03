// filepath: d:\zCode\Web\to-do\todo-backend\src\routes\tasks.ts
import { Router, Request, Response } from 'express';
import { Task } from '../models/Task';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// GET all tasks for current user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
});

// POST new task for current user
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }
    const task = new Task({ title, owner: req.userId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating task' });
  }
});

// PUT update task (only if owner)
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: id, owner: req.userId },
      { completed },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating task' });
  }
});

// DELETE task (only if owner)
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, owner: req.userId });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting task' });
  }
});

export default router;