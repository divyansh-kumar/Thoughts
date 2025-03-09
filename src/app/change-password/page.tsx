"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../../utils/supabase';


const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        setError(error.message);
      } else {
        alert("Password updated successfully!");
        router.push("/login"); // Redirect to login after success
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Error updating password:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-white dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h1 className="mt-5 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Change Password
        </h1>

        <div className="mt-2 space-y-5">
          {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-3 w-full rounded-md bg-white dark:bg-gray-800 px-5 py-3 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-700 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-3 w-full rounded-md bg-white dark:bg-gray-800 px-5 py-3 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-700 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-indigo-600 disabled:bg-indigo-400"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;