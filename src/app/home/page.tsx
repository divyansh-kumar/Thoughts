"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";

const API_BASE_URL = "http://localhost:3000/api";
const IMAGE_BASE_URL = "https://s3.us-east-005.backblazeb2.com/divyansh-testing";

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
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
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

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

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
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments || []);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
      } else {
        console.error("Failed to like post");
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">


      {/* Owner button and post details */}
      <div className="mb-2">
        <Link href={`/user/${post.user_id}`}>
          <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
            {post.name}
          </button>
        </Link>
        <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
          {post.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {post.description}
        </p>
      </div>


      <div className="flex justify-between">
        <div>
          {/* Image Section */}
          {post.image_url && (
            <Image
              src={`${IMAGE_BASE_URL}${post.image_url}`}
              alt={post.title}
              width={800}
              height={300}
              className="object-cover"
            />

          )}
        </div>
        <div>
          {/* Comments Section as a Table */}
          <div className="justify-start">
            <h3 className="font-semibold text-lg mb-2">Comments</h3>
            <div>
              <table className="min-w-full border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                      Comment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {comments.length > 0 ? (
                    comments.map((comment: string, index: number) => (
                      <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                          {comment}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                        No comments yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>



      {/* Like/Comment Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleLike}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Like ({likes})
        </button>
        <button
          onClick={() => setShowCommentPopup(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Comment ({comments.length})
        </button>
      </div>

      {/* Comment Popup */}
      {showCommentPopup && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg z-10">
              <h2 className="text-xl font-bold mb-4">Add Comment</h2>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-4 w-full px-3 py-2 border rounded"
                placeholder="Type your comment here..."
              ></textarea>
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
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setShowCommentPopup(false)}
          ></div>
        </>
      )}
    </div>
  );
}
