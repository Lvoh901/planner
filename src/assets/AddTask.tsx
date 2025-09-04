import { PlusCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";
import supabase from "../supabase";

type AddTaskProps = {
  onTaskAdded?: () => void;
  isLoading: boolean;
};

const AddTask: React.FC<AddTaskProps> = ({ onTaskAdded, isLoading }) => {
  const [newTask, setNewTask] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!newTask.trim()) {
      setError("Task name is required.");
      return;
    }
    if (!startTime) {
      setError("Start time is required.");
      return;
    }
    if (!endTime) {
      setError("End time is required.");
      return;
    }
    if (endTime <= startTime) {
      setError("End time must be after start time.");
      return;
    }
    if (isLoading || localLoading) return;

    setLocalLoading(true);
    const { error: supabaseError } = await supabase
      .from("planner")
      .insert([{ activity: newTask, start_time: startTime, end_time: endTime }]);

    if (supabaseError) {
      setError("Failed to add task. Please try again.");
      console.error("Error adding task:", supabaseError);
    } else {
      setNewTask("");
      setStartTime("");
      setEndTime("");
      if (onTaskAdded) {
        onTaskAdded();
      }
    }
    setLocalLoading(false);
  };

  return (
    <div className="container mx-auto p-5">
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="flex flex-wrap justify-center gap-2">
          <input
            type="text"
            placeholder="Add a new task (e.g. Morning Exercise)"
            className="flex-1 bg-white focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-t-lg px-4 py-2 text-gray-800 transition border border-gray-200"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            disabled={isLoading || localLoading}
            maxLength={50}
            aria-label="Task name"
            required
          />

          <input
            type="time"
            className="w-32 bg-white focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-t-lg px-4 py-2 text-gray-800 transition border border-gray-200 text-sm"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isLoading || localLoading}
            aria-label="Start time"
            required
          />

          <input
            type="time"
            className="w-32 bg-white focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-t-lg px-4 py-2 text-gray-800 transition border border-gray-200 text-sm"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={isLoading || localLoading}
            aria-label="End time"
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 rounded px-3 py-2 text-sm mt-1">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <button
          className={`flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-b-lg font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
          type="submit"
          disabled={isLoading || localLoading}
        >
          {(isLoading || localLoading) ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
          {localLoading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
