import { PlusCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import supabase from "../supabase";

type AddTaskProps = {
  onTaskAdded?: () => void;
  isLoading: boolean;
};

const AddTask: React.FC<AddTaskProps> = ({ onTaskAdded, isLoading }) => {
  const [newTask, setNewTask] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!newTask.trim()) {
      setError("Task name is required.");
      return;
    }
    if (isLoading || localLoading) return;

    setLocalLoading(true);
    const { error: supabaseError } = await supabase
      .from("planner")
      .insert([{ activity: newTask }]);

    if (supabaseError) {
      setError("Failed to add task. Please try again.");
      console.error("Error adding task:", supabaseError);
    } else {
      setNewTask("");
      if (onTaskAdded) {
        onTaskAdded();
      }
    }
    setLocalLoading(false);
  };

  return (
    <div className="w-full">
      <form
        className="flex flex-col sm:flex-row gap-3"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder="What's your focus today?"
            className="w-full bg-white/70 backdrop-blur-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-xl px-4 py-3 text-slate-700 transition shadow-inner border border-white/50 placeholder:text-slate-400"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            disabled={isLoading || localLoading}
            // maxLength={50}
            aria-label="Task name"
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 rounded px-3 py-2 text-sm mt-1 sm:hidden">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <button
          className={`flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-95`}
          type="submit"
          disabled={isLoading || localLoading}
        >
          {(isLoading || localLoading) ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          {localLoading ? "Adding..." : "Add Task"}
        </button>
      </form>
      {error && (
        <div className="hidden sm:flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 text-sm mt-2 shadow-sm animate-shake">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default AddTask;
