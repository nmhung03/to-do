import React, { useState, useEffect } from 'react';
import { Task } from './types/Task';
import { taskService } from './services/taskService';
import AddTask from './components/AddTask';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Lấy danh sách tasks khi component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await taskService.getAllTasks();
      setTasks(tasksData);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách tasks. Vui lòng kiểm tra kết nối server.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title: string) => {
    try {
      const newTask = await taskService.createTask(title);
      setTasks(prev => [newTask, ...prev]);
      setError('');
    } catch (err) {
      setError('Không thể thêm task mới.');
      console.error('Error adding task:', err);
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      const updatedTask = await taskService.updateTask(id, completed);
      setTasks(prev =>
        prev.map(task =>
          task._id === id ? updatedTask : task
        )
      );
      setError('');
    } catch (err) {
      setError('Không thể cập nhật task.');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      setError('');
    } catch (err) {
      setError('Không thể xóa task.');
      console.error('Error deleting task:', err);
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📝 Todo App
          </h1>
          <p className="text-gray-600">
            Quản lý công việc của bạn một cách hiệu quả
          </p>
          {totalCount > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Hoàn thành: {completedCount}/{totalCount} tasks
            </div>
          )}
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button
              onClick={fetchTasks}
              className="ml-2 text-red-800 underline hover:no-underline"
            >
              Thử lại
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <AddTask onAddTask={handleAddTask} />

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Đang tải...</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
