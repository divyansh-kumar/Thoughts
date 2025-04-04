"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/hooks/useAuth"; 

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const router = useRouter(); 
  useAuth();

  useEffect(() => {
    const uid = sessionStorage.getItem("userID");
    if (uid) {
      fetch(`/api/user-details?uid=${uid}`)
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error(err));
    }
  }, []);

  if (!userData) {
    console.log("userData is null", userData);
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <p>
          <strong>Name:</strong> {userData.name}
        </p>
        <p>
          <strong>User ID:</strong> {userData.uid}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Posts:</strong> {userData.postsCount}
        </p>
        <p>
          <strong>Following:</strong> {userData.followingCount}
        </p>
        <p>
          <strong>Followers:</strong> {userData.followersCount}
        </p>
        <button
          onClick={() => setShowResetPopup(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reset Password
        </button>
        <a href="/logout">
        <button
          onClick={() => setShowResetPopup(true)}
          className="mt-4 m-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Logout
        </button>
        </a>
        
      </div>

      {showResetPopup && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg z-10">
              <h2 className="text-xl font-bold mb-4">Reset Password</h2>
              <form>
                <input
                  type="password"
                  placeholder="New Password"
                  className="mb-4 w-full px-3 py-2 border rounded"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowResetPopup(false)}
                    className="mr-2 px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setShowResetPopup(false)}
          ></div>
        </>
      )}
    </div>
  );
}
