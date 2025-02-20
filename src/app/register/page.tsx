// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Registration failed");
        return;
      }
      alert("Registration successful! Please login.");
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-white dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h1 className="mt-5 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Register
        </h1>

        <div className="mt-2 space-y-5">
          {error && (
            <p className="mb-4 text-center text-sm text-red-500">{error}</p>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="mt-3 w-full rounded-md bg-white dark:bg-gray-800 px-5 py-3 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-700 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="mt-3 w-full rounded-md bg-white dark:bg-gray-800 px-5 py-3 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-700 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="mt-3 w-full rounded-md bg-white dark:bg-gray-800 px-5 py-3 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-700 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <button
                type="submit"
                className="mt-5 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>

         
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-gray-600 dark:text-gray-300">
        Have an account?{" "}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}
