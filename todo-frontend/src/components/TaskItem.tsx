import React from 'react';
import { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onToggle(task._id, e.target.checked)}
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <span
          className={`text-lg ${task.completed
              ? 'line-through text-gray-500'
              : 'text-gray-900'
            }`}
        >
          {task.title}
        </span>
      </div>
      <button
        onClick={() => onDelete(task._id)}
        className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Xóa
      </button>
    </div>
  );
};

export default TaskItem;
