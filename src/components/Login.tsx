import { useState } from "react";
import supabase from "../supabase";
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && ("error_description" in err || "message" in err)) {
        // @ts-expect-error
        setError((err as { error_description?: string; message?: string }).error_description || (err as { message?: string }).message);
      } else {
        setError("Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center min-h-screen h-screen bg-transparent z-50">
      <div className="relative w-full max-w-md p-8 sm:p-10 space-y-7 bg-white/90 backdrop-blur-lg border border-indigo-100 rounded-3xl shadow-2xl animate-fade-in">
        {/* Background pattern accent */}
        <div className="absolute top-0 -left-14 w-40 h-40 bg-gradient-to-br from-blue-400 via-indigo-300 to-transparent rounded-full blur-2xl opacity-30 pointer-events-none"></div>

        <div className="absolute bottom-2 -right-14 w-40 h-40 bg-gradient-to-tr from-indigo-400 via-blue-300 to-transparent rounded-full blur-2xl opacity-20 pointer-events-none"></div>

        {/* Logo or brand */}
        <div className="flex flex-col items-center mb-3">
          <div className="bg-gradient-to-b from-indigo-500 to-blue-400 w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-1">
            <span className="text-white text-4xl font-bold font-mono">DP</span>
          </div>
          <h2 className="text-3xl font-extrabold text-center tracking-tighter text-blue-700 drop-shadow mb-1">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 text-base font-medium">
            Sign in to your <span className="font-semibold text-indigo-600">Daily Planner</span>
          </p>
        </div>
        {error && (
          <div className="flex items-center gap-2 justify-center bg-red-50 border border-red-200 text-red-700 py-2 px-4 rounded-lg mb-1 text-sm shadow animate-shake">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="text-xs font-semibold text-gray-600 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-300">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email"
                className={`w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg shadow-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition placeholder-gray-400 text-sm ${error ? "border-red-300" : ""
                  }`}
                type="email"
                placeholder="Enter your email"
                value={email}
                autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-semibold text-gray-600 block mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-300">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                className={`w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg shadow-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition placeholder-gray-400 text-sm ${error ? "border-red-300" : ""
                  }`}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              {/* Password show/hide toggle */}
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center px-1 text-indigo-400 hover:text-indigo-700 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <a
                href="#"
                tabIndex={-1}
                className="text-xs text-indigo-500 hover:underline hover:text-indigo-700 font-medium transition"
                style={{ pointerEvents: "none", opacity: 0.6 }}
                aria-disabled="true"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 font-bold text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 rounded-xl shadow-md hover:shadow-lg hover:brightness-105 hover:scale-[1.02] active:scale-98 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 text-base ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
        <div className="flex flex-col items-center gap-1">
          <div className="text-xs text-gray-400 text-center">
            Don&apos;t have an account?{" "}
            <span className="font-semibold text-indigo-600/90 cursor-not-allowed opacity-60 underline underline-offset-2">
              Sign up coming soon
            </span>
          </div>

          <div className="text-[11px] text-gray-300 text-center mt-2">
            &copy; {new Date().getFullYear()} <span className="font-bold text-indigo-700">Daily Planner</span>
            {" "}&mdash; All rights reserved.
          </div>

          <div className="text-xs text-gray-500 mt-auto mb-2 text-center">
            Made by <a href="https://odhiambolvis.tech/" className="text-blue-600 font-bold underline underline-offset-2 uppercase">Lvoh</a>
          </div>
        </div>
      </div>
    </div>
  );
}
