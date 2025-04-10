"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/hooks/useAuth"; 

export default function UserProfilePage() {
  const { uid } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUid, setCurrentUid] = useState<string | null>(null);
    const router = useRouter(); 
    useAuth();

  useEffect(() => {
    const storedUid = sessionStorage.getItem("userID");
    setCurrentUid(storedUid);

    fetch(`/api/user-details?uid=${uid}${storedUid ? `&currentUid=${storedUid}` : ""}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          return;
        }
        setUserData(data);
        setIsFollowing(data.followingCount); 
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [uid]);

  if (!userData) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  const handleFollowToggle = async () => {
    if (!currentUid) return;

    const action = isFollowing ? "unfollow" : "follow";
    try {
      const res = await fetch(`/api/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: currentUid, followingId: uid, action }),
      });
      if (res.ok) {
        setIsFollowing(!isFollowing); 
      } else {
        console.error("Follow action failed");
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">{userData.name}</h1>
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
          onClick={handleFollowToggle}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
}
