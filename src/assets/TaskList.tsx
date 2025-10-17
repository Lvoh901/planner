import { PencilLine, TrashIcon, Save, XCircle } from "lucide-react";
import ClearTask from "./ClearTask";
import React, { useState } from "react";
import type { ChangeEvent } from "react";

type Task = {
  id: number;
  activity: string;
  is_completed: boolean;
};

type TaskListProps = {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onClearTasks: () => void;
  onUpdateTask: (task: Task) => void;
  onToggleTask: (id: number, is_completed: boolean) => void; // Add this line
  isLoading: boolean;
};

const TaskList: React.FC<TaskListProps> = ({  tasks,
  onDeleteTask,
  onClearTasks,
  onUpdateTask,
  onToggleTask, // Add this line
  isLoading,
}) => {
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTask({ ...task });
    setEditError(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedTask(null);
    setEditError(null);
  };

  const handleSaveEdit = () => {
    if (!editedTask) return;
    // Validation: activity not empty, start_time and end_time present, end > start
    if (!editedTask.activity.trim()) {
      setEditError("Task name is required.");
      return;
    }
    onUpdateTask(editedTask);
    setEditingTaskId(null);
    setEditedTask(null);
    setEditError(null);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (!editedTask) return;
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
    setEditError(null);
  };

  return (
    <div className="container mx-auto px-5">
      <div className="overflow-x-auto rounded-xl shadow border border-blue-100 bg-white">
        <table className="min-w-full table-fixed sm:table-auto">
          <thead>
            <tr className="bg-blue-100 text-gray-700 uppercase text-xs sm:text-sm">
              <th className="py-3 px-2 sm:px-4 text-center w-1/12 sm:w-auto">Status</th>
              <th className="py-3 px-2 sm:px-4 text-left w-2/5 sm:w-auto">Activity</th>
              <th className="py-3 px-2 sm:px-4 text-center w-1/5 sm:w-auto">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && tasks.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 px-2 sm:px-6 text-center text-gray-400">
                  <span className="inline-flex items-center gap-2 animate-pulse">
                    <svg className="w-4 h-4 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Loading tasks...
                  </span>
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 px-2 sm:px-6 text-center text-gray-400">
                  <span className="inline-flex items-center gap-2">
                    <PencilLine className="w-4 h-4 text-blue-300" />
                    No tasks yet. Add one above!
                  </span>
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className={`border-b last:border-b-0 transition ${
                    editingTaskId === task.id
                      ? "bg-blue-50/70"
                      : "hover:bg-blue-50/50"
                  }`}
                >
                  <td className="py-3 px-2 sm:px-4 text-center align-middle">
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => onToggleTask(task.id, !task.is_completed)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      disabled={isLoading}
                    />
                  </td>
                  <td className={`py-3 px-2 sm:px-4 font-medium text-gray-900 capitalize align-middle max-w-[8rem] sm:max-w-xs ${task.is_completed ? 'line-through' : ''}`}>
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        name="activity"
                        value={editedTask?.activity ?? ""}
                        onChange={handleInputChange}
                        className="w-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1 text-sm"
                        disabled={isLoading}
                        autoFocus
                        maxLength={60}
                        placeholder="Task name"
                      />
                    ) : (
                      <span className="truncate block">{task.activity}</span>
                    )}
                  </td>

                  <td className="py-3 px-2 sm:px-4 text-center align-middle">
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                      {editingTaskId === task.id ? (
                        <>
                          <button
                            className="cursor-pointer"
                            title="Save"
                            aria-label="Save"
                            onClick={handleSaveEdit}
                            disabled={isLoading}
                          >
                            <Save className="w-5 h-5 text-green-600" />
                          </button>

                          <button
                            className="cursor-pointer"
                            title="Cancel"
                            aria-label="Cancel"
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                          >
                            <XCircle className="w-5 h-5 text-red-600" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="cursor-pointer"
                            title="Edit"
                            aria-label="Edit"
                            onClick={() => handleEditClick(task)}
                            disabled={isLoading}
                          >
                            <PencilLine className="w-5 h-5 text-blue-600" />
                          </button>

                          <button
                            className="cursor-pointer"
                            title="Delete"
                            aria-label="Delete"
                            onClick={() => onDeleteTask(task.id)}
                            disabled={isLoading}
                          >
                            <TrashIcon className="w-5 h-5 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                    {editingTaskId === task.id && editError && (
                      <div className="mt-2 text-xs text-red-500 text-left">
                        {editError}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-end items-stretch gap-2">
        <ClearTask onClearTasks={onClearTasks} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default TaskList;
