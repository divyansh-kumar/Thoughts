"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../../utils/supabase';


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(""); // To display error messages
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear previous errors

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/change-password", // URL to redirect after clicking the reset link
      });

      if (error) {
        setError(error.message); // Display error if something goes wrong
      } else {
        alert("Password reset link sent! Check your email.");
        router.push("/login"); // Redirect to login page after success
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Error sending reset link:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-white dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h1 className="mt-5 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Forgot Password
        </h1>

        <div className="mt-2 space-y-5">
          {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Enter Your Email
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

            <button
              type="submit"
              disabled={loading} // Disable button while loading
              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-indigo-600 disabled:bg-indigo-400"
            >
              {loading ? "Sending..." : "Send Link"}
            </button>
          </form>
        </div>
      </div>
      <p className="mt-10 text-center text-sm text-gray-600 dark:text-gray-300">
        Move to Login{" "}
        <a href="/login" className="text-indigo-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default ForgotPassword;