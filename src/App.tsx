import "./App.css";
import AddTask from "./assets/AddTask";
import TaskList from "./assets/TaskList";
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      {!session ? (
        <Login />
      ) : (
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-4">
          <Logout />

          <h1 className="font-bold text-center mb-2 text-blue-700 tracking-tight drop-shadow">
            Daily Planner
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Organize your day, one task at a time.
          </p>

          {errorMessage && (
            <div className="flex items-center justify-center gap-2 bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-blue-600 font-medium">Loading...</span>
            </div>
          )}

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
      )}

      <footer className="text-xs text-gray-500 mt-auto mb-2 text-center">
        &copy; {new Date().getFullYear()} Daily Planner. Made by <a href="https://odhiambolvis.tech/" className="text-blue-600 font-bold underline underline-offset-2 uppercase">Lvoh</a>
      </footer>
    </div>
  );
}

export default App;
