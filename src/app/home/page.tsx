"use client";

import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";

const API_BASE_URL = "/api";
const IMAGE_BASE_URL =
  "https://s3.us-east-005.backblazeb2.com/divyansh-testing";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${API_BASE_URL}/get-post`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    console.log("searchQuery:", searchQuery);
  }, [searchQuery]);

  const filteredPosts = searchQuery.trim()
    ? posts.filter((post) => {
      if (!post.tags) return false;
      const tagsArray =
        typeof post.tags === "string"
          ? post.tags.replace(/[{}]/g, "").split(",")
          : post.tags;
      return tagsArray.some((tag: string) =>
        tag.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    })
    : posts;

  useEffect(() => {
    console.log("filteredPosts:", filteredPosts);
  }, [filteredPosts]);

  if (loading)
    return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Pass searchQuery and its setter to TopBar */}
      <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p className="text-center text-xl text-gray-700 dark:text-gray-200">
            No posts found for tag &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>
    </main>
  );
}


const handleSendEmail = async (post: any) => {
  console.log('Sending email...', post);
  const endpoint = 'https://mail.divyanshkumar.workers.dev/'; 
  
  const payload = {
    to: 'mail@divyansh.org',
    subject: `Post Details - ${post.id}`,
    text: `Post Details:
      Post ID: ${post.id}
      User ID: ${post.user_id}
      Posted At: ${post.timestamp || new Date().toISOString()}
      Title: ${post.title}
      Description: ${post.description}
    `,
    html: `
      <h2>Post Details</h2>
      <p><strong>Post ID:</strong> ${post.id}</p>
      <p><strong>User ID:</strong> ${post.user_id}</p>
      <p><strong>Posted At:</strong> ${post.timestamp || new Date().toISOString()}</p>
      <p><strong>Title:</strong> ${post.title}</p>
      <p><strong>Description:</strong> ${post.description}</p>
    `,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (response.ok) {
      console.log('Email sent successfully!', data);
    } else {
      console.error('Error sending email:', data);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};


function PostCard({ post }: { post: any }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [liked, setLiked] = useState(
    (post.likes || []).includes(sessionStorage.getItem("userID"))
  );
  const [comments, setComments] = useState(post.comments || []);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);

  const handleToggleLike = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          userId: sessionStorage.getItem("userID"),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setLiked(data.likes.includes(sessionStorage.getItem("userID")));
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsZoomed(false);
      }
    };

    if (isZoomed) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isZoomed]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div
        className="grid w-full dark:bg-gray-800 rounded-t-none overflow-hidden flex-1 p-4 md:p-2
          grid-cols-1 md:grid-cols-6
          grid-rows-[auto_auto_auto_repeat(6,1fr)_auto_auto_auto-auto]
          gap-2"
      >
        <div className="col-span-1 md:col-span-5 row-start-1">
          <a
            href={`/user/${post.user_id}`}
            className="text-white font-[sourcesanspro] text-1xl md:text-3xl"
          >
            {post.name}
          </a>
        </div>

        <div className="col-span-1 md:col-span-5 row-start-2">
          <h2 className="text-white font-[sourcesanspro] text-2xl md:text-4xl">
            {post.title}
          </h2>
        </div>

        <div className="col-start-1 md:col-start-7 row-start-3 md:row-start-1">
          <h3 className="text-white font-[sourcesanspro] text-2xl md:text-4xl">
            Comments
          </h3>
        </div>

        <div className="col-start-1 md:col-start-8 row-start-3 md:row-start-1">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => handleSendEmail(post)}
          >
            R
          </button>
        </div>

        <div className="col-span-1 md:col-span-5 row-start-4 md:row-start-3">
          <p className="text-white font-[sourcesanspro] text-lg md:text-xl">
            {post.description}
          </p>
        </div>

        {post.image_url && (
          <div
            onClick={() => setIsZoomed(true)}
            className="col-span-1 md:col-span-5 row-start-5 md:row-start-4 row-end-13 m-4 md:m-12 justify-self-center cursor-pointer"
          >
            <img
              src={`${IMAGE_BASE_URL}${post.image_url}`}
              alt={post.title}
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        )}

        <div className="col-span-1 md:col-start-6 md:col-end-13 rounded-xl row-start-6 md:row-start-2 row-end-13 m-4 md:m-5 dark:bg-gray-700 p-4">
          <table className="w-full dark:bg-gray-700">
            <tbody>
              {comments && comments.length > 0 ? (
                comments.map((comment: string, index: number) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-2 md:px-4 py-2 text-sm text-white">
                      {comment}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-2 md:px-4 py-2 text-sm text-white">
                    This post doesn’t have any comments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="col-span-1 md:col-start-6 md:col-end-9 row-start-14 md:row-start-13 mt-2">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCommentSubmit();
              }
            }}
            className="w-full px-3 py-2 border rounded text-white bg-gray-800"
            placeholder="Press enter to comment..."
          />
        </div>

        <div className="col-span-1 md:col-span-1 row-start-15 md:row-start-13 flex items-center space-x-4">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleToggleLike}
          >
            <img
              src={liked ? "/heartred.png" : "/heart.png"}
              alt="Like Button"
              width={32}
              height={32}
            />
            <span>{likes ? likes.length : 0}</span>
          </div>
        </div>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={`${IMAGE_BASE_URL}${post.image_url}`}
              alt={post.title}
              className="max-w-[90vw] max-h-[90vh]"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-2 right-2 text-white bg-gray-800 p-2 rounded-full text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
