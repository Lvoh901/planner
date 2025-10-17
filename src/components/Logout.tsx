import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import supabase from "../supabase";

export default function Logout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      // Explicitly get the session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (session) {
        const { error } = await supabase.auth.signOut({ scope: 'local' });
        if (error) throw error;
      } else {
        throw new Error("No active session to sign out from.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 mb-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 py-1 px-3 rounded text-xs animate-fade-in">
          <span>{error}</span>
        </div>
      )}
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`bg-red-600 text-white font-bold uppercase text-xs rounded-md transition-all duration-150
        shadow-sm hover:shadow-lg cursor-pointer hover:scale-105 px-3 py-2 flex gap-2 items-center outline-none
        focus:ring focus:ring-red-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed`}
        aria-busy={loading}
        aria-label="Sign out of your account"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Logging out...
          </>
        ) : (
          <>
            Logout
            <LogOut className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
