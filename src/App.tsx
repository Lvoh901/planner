import "./App.css";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import { useState, useEffect } from "react";
import supabase from "./supabase";
import { Loader2, AlertCircle } from "lucide-react";
import Login from "./components/Login";
import Logout from "./components/Logout";

type Task = {
  id: number;
  activity: string;
  is_completed: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsSessionLoading(true);
    console.log("Checking session...");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      setSession(session);
      setIsSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      let { data: fetchedTasks, error } = await supabase.from("planner").select("*");
      if (error) {
        throw error;
      } else {
        setTasks(fetchedTasks ?? []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setErrorMessage("Failed to fetch tasks.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteTask(taskId: number) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.from("planner").delete().eq("id", taskId);
      if (error) {
        throw error;
      } else {
        setTasks(tasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setErrorMessage("Failed to delete task.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleClearTasks() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.from("planner").delete().neq("id", 0);
      if (error) {
        throw error;
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error clearing tasks:", error);
      setErrorMessage("Failed to clear tasks.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateTask(updatedTask: Task) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase
        .from("planner")
        .update({
          activity: updatedTask.activity,
        })
        .eq("id", updatedTask.id);

      if (error) {
        throw error;
      } else {
        setTasks(
          tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setErrorMessage("Failed to update task.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleTask(taskId: number, is_completed: boolean) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase
        .from("planner")
        .update({ is_completed })
        .eq("id", taskId);

      if (error) {
        throw error;
      } else {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, is_completed } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      setErrorMessage("Failed to update task status.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (session) {
      fetchData();
      const interval = setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
          handleClearTasks();
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-8 font-sans text-slate-800">
      {isSessionLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span className="text-white font-medium text-xl tracking-wide">Loading Session...</span>
        </div>
      ) : !session ? (
        <div className="glass p-8 rounded-3xl shadow-2xl w-full max-w-md animate-float">
          <Login />
        </div>
      ) : (
        <div className="w-full max-w-4xl glass rounded-3xl shadow-2xl p-6 sm:p-10 transition-all duration-300 backdrop-blur-xl bg-white/60 border border-white/40">
          <Logout />

          <div className="mb-8 text-center">
            <h1 className="font-bold text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 mb-2 drop-shadow-sm">
              Daily Planner
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Organize your day, simply and beautifully.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-center justify-center gap-2 bg-red-100/80 border border-red-300 text-red-700 rounded-xl px-4 py-3 mb-6 shadow-sm backdrop-blur-md">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-blue-700 font-medium">Updating...</span>
            </div>
          )}

          <div className="space-y-8">
            <AddTask onTaskAdded={fetchData} isLoading={isLoading} />
            <TaskList
              tasks={tasks}
              onDeleteTask={handleDeleteTask}
              onClearTasks={handleClearTasks}
              onUpdateTask={handleUpdateTask}
              onToggleTask={handleToggleTask}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
