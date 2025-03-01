"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";

const API_BASE_URL = "http://localhost:3000/api";
const IMAGE_BASE_URL = "https://s3.us-east-005.backblazeb2.com/divyansh-testing";

// For demonstration purposes, we hardcode a dummy current user id.
// Replace this with your actual authenticated user's id.

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts on mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${API_BASE_URL}/get-post`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}

function PostCard({ post }: { post: any }) {
  // Initialize likes as an array and set the liked state based on whether the current user id is in it.
  const [likes, setLikes] = useState(post.likes || []);
  const [liked, setLiked] = useState((post.likes || []).includes(localStorage.getItem("userID")));
  const [comments, setComments] = useState(post.comments || []);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleToggleLike = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, userId: localStorage.getItem("userID") }),
      });
      if (res.ok) {
        const data = await res.json();
        // data.likes is the updated array of user ids.
        setLikes(data.likes);
        setLiked(data.likes.includes(localStorage.getItem("userID")));
      } else {
        console.error("Failed to toggle like");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/get-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, comment: commentText }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        setCommentText("");
        setShowCommentPopup(false);
      } else {
        console.error("Failed to add comment");
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (

    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">      {/* Main Grid Container */}
      <div className="grid w-full dark:bg-gray-800 rounded-t-none overflow-hidden flex-1 p-4 md:p-2
        grid-cols-1 md:grid-cols-6
        grid-rows-[auto_auto_auto_repeat(6,1fr)_auto_auto_auto_auto]
        gap-2">

        <div className="col-span-1 md:col-span-5 row-start-1">
          <a href={`/user/${post.user_id}`} className="text-white font-[sourcesanspro] text-1xl md:text-3xl">
            {post.name}
          </a>
        </div>

        <div className="col-span-1 md:col-span-5 row-start-2">
          <h2 className="text-white font-[sourcesanspro] text-2xl md:text-4xl">
            {post.title}
          </h2>
        </div>

        {/* Comments Header - Row 3 on small screens, Row 2 on md+ */}
        <div className="col-start-1 md:col-start-7 row-start-3 md:row-start-1">
          <h3 className="text-white font-[sourcesanspro] text-2xl md:text-4xl">
            Comments
          </h3>
        </div>

        {/* Content - Row 4 on small screens, Row 3 on md+ */}
        <div className="col-span-1 md:col-span-5 row-start-4 md:row-start-3">
          <p className="text-white font-[sourcesanspro] text-lg md:text-xl">
            {post.description}
          </p>
        </div>

        {/* Image - Rows 5-12 */}
        {post.image_url && (
          <div className="col-span-1 md:col-span-5 row-start-5 md:row-start-4 row-end-13 m-4 md:m-12 justify-self-center">
            <img
              src={`${IMAGE_BASE_URL}${post.image_url}`}
              alt={post.title}
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        )}

        {/* Comments Section - Rows 6-12 on small screens, Rows 3-12 on md+ */}
        <div className="col-span-1 md:col-start-6 md:col-end-13 rounded-xl row-start-6 md:row-start-2 row-end-13 m-4 md:m-5 bg-[#B1B2B5] p-4">
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 md:px-4 py-2 text-left text-sm text-gray-700">Comment</th>
              </tr>
            </thead>
            <tbody>
              {comments.length > 0 ? (
                comments.map((comment: string, index: number) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-2 md:px-4 py-2 text-sm text-gray-800">{comment}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-2 md:px-4 py-2 text-sm text-gray-800">
                    This post doesn't have any comments yet.
                  </td>
                </tr>
              )}
              <tr>
                <td className="px-2 md:px-4 py-2">
                  <button
                    onClick={() => setShowCommentPopup(true)}
                    className="px-4 md:px-8 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    Comment
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Right Rectangle - Row 14 on small screens, Row 13 on md+ */}
        <div className="col-span-1 md:col-start-6 md:col-end-9 row-start-14 md:row-start-13 m-4 md:m-[10px_20px] bg-[#B1B2B5]" />

        {/* Like Button - Row 15 on small screens, Row 13 on md+ */}
        <div className="col-span-1 md:col-span-1 row-start-15 md:row-start-13 flex items-center space-x-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleToggleLike}>
            <img
              src={liked ? "/heartred.png" : "/heart.png"}
              alt="Like Button"
              width={32}
              height={32}
            />
            <span>{likes.length}</span>
          </div>
        </div>
      </div>

      {/* Comment Popup */}
      {showCommentPopup && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg z-10">
              <h2 className="text-xl font-bold mb-4">Add Comment</h2>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-4 w-full px-3 py-2 border rounded text-white"
                placeholder="Type your comment here..."
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setShowCommentPopup(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommentSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div
            className="fixed inset-0 bg-white opacity-50 z-40"
            onClick={() => setShowCommentPopup(false)}
          />
        </>
      )}
    </div>
  );
}
