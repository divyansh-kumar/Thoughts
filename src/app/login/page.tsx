"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Added for "Remember Me"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Always store userID in sessionStorage
        sessionStorage.setItem("email", email); // Optional, if you need email
        sessionStorage.setItem("userID", data.userID);

        // If "Remember Me" is checked, store in localStorage too
        if (rememberMe) {
          localStorage.setItem("userID", data.userID);
          localStorage.setItem("email", email); // Optional, if you need email
        }
        router.push("/home");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-white dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h1 className="mt-5 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Login
        </h1>

        <div className="mt-2 space-y-5">
          {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-3 w-full rounded-md bg-white dark:bg-gray-800 px-5 py-3 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-700 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-3 w-full rounded-md bg-white dark:bg-gray-800 px-5 py-3 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-700 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="mt-5 flex items-center text-gray-900 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 rounded border-gray-300 dark:border-gray-700"
                />
                Remember me
              </label>
              <a href="forgot-password" className="mt-5 text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-indigo-600"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
      {/* Don't have an account? */}
      <p className="mt-10 text-center text-sm text-gray-600 dark:text-gray-300">
        Don't have an account?{" "}
        <a href="/register" className="text-indigo-600 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
};

export default Login;