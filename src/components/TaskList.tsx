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
  onToggleTask: (id: number, is_completed: boolean) => void;
  isLoading: boolean;
};

// You can adjust maxHeight as necessary.
const SCROLLABLE_MAX_HEIGHT = "400px";

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDeleteTask,
  onClearTasks,
  onUpdateTask,
  onToggleTask,
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
    if (!editedTask.activity.trim()) {
      setEditError("Task name is required.");
      return;
    }
    onUpdateTask(editedTask);
    setEditingTaskId(null);
    setEditedTask(null);
    setEditError(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editedTask) return;
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
    setEditError(null);
  };

  return (
    <div className="w-full">
      <div
        className="overflow-hidden rounded-2xl shadow-sm border border-white/50 bg-white/40 backdrop-blur-md"
      >
        <div
          style={{
            maxHeight: SCROLLABLE_MAX_HEIGHT,
            overflowY: "auto",
            overflowX: "auto",
          }}
          className="scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent"
        >
          <table className="min-w-full">
            <thead className="sticky top-0 z-10 bg-purple-100/90 backdrop-blur-sm text-purple-900">
              <tr className="uppercase text-xs font-bold tracking-wider">
                <th className="py-4 px-4 text-center w-16">Status</th>
                <th className="py-4 px-4 text-left">Activity</th>
                <th className="py-4 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-purple-100/50">
              {isLoading && tasks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400">
                    <span className="inline-flex items-center gap-3 animate-pulse text-lg">
                      <svg className="w-6 h-6 text-purple-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      Loading tasks...
                    </span>
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                        <PencilLine className="w-6 h-6 text-purple-400" />
                      </div>
                      <span className="font-medium">No tasks yet. Start by adding one!</span>
                    </div>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr
                    key={task.id}
                    className={`transition-colors duration-200 group ${editingTaskId === task.id
                      ? "bg-purple-50/80"
                      : "hover:bg-white/60 bg-transparent"
                      }`}
                  >
                    <td className="py-3 px-4 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={task.is_completed}
                        onChange={() => onToggleTask(task.id, !task.is_completed)}
                        className="w-5 h-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-offset-0 cursor-pointer transition-all hover:scale-110 checked:bg-green-500 checked:border-green-500"
                        disabled={isLoading}
                      />
                    </td>

                    <td className={`py-3 px-4 font-medium text-slate-700 align-middle ${task.is_completed ? 'line-through text-slate-400 decoration-slate-400' : ''}`}>
                      {editingTaskId === task.id ? (
                        <input
                          type="text"
                          name="activity"
                          value={editedTask?.activity ?? ""}
                          onChange={handleInputChange}
                          className="w-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg px-3 py-2 text-sm shadow-sm"
                          disabled={isLoading}
                          autoFocus
                          placeholder="Task name"
                        />
                      ) : (
                        <span className="block text-base">{task.activity}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center align-middle">
                      <div className="flex justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        {editingTaskId === task.id ? (
                          <>
                            <button
                              className="p-2 rounded-full hover:bg-green-100 text-green-600 transition"
                              title="Save"
                              onClick={handleSaveEdit}
                              disabled={isLoading}
                            >
                              <Save className="w-5 h-5" />
                            </button>

                            <button
                              className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                              title="Cancel"
                              onClick={handleCancelEdit}
                              disabled={isLoading}
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition"
                              title="Edit"
                              onClick={() => handleEditClick(task)}
                              disabled={isLoading}
                            >
                              <PencilLine className="w-5 h-5" />
                            </button>

                            <button
                              className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                              title="Delete"
                              onClick={() => onDeleteTask(task.id)}
                              disabled={isLoading}
                            >
                              <TrashIcon className="w-5 h-5" />
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
      </div>
      <div className="mt-6 flex justify-end">
        <ClearTask onClearTasks={onClearTasks} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default TaskList;
