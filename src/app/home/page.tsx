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
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Debug: log search query whenever it changes
  useEffect(() => {
    console.log("searchQuery:", searchQuery);
  }, [searchQuery]);

  // Filter posts by tag (case-insensitive)
  const filteredPosts = searchQuery.trim()
    ? posts.filter((post) => {
      if (!post.tags) return false;
      // If tags are in string format, convert them to an array
      const tagsArray =
        typeof post.tags === "string"
          ? post.tags.replace(/[{}]/g, "").split(",")
          : post.tags;
      return tagsArray.some((tag: string) =>
        tag.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    })
    : posts;

  // Debug: log the filtered posts
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
  const endpoint = 'https://mail.divyanshkumar.workers.dev/'; // update with your Cloudflare Worker URL
  
  const payload = {
    // Use 'to' to match what the Worker expects
    to: 'mail@divyansh.org',
    subject: `Post Details - ${post.id}`,
    // You can include both text and html if your Worker supports it
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

    // Determine if the response is JSON before parsing
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

        {/* Button on top left */}
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
          <div className="col-span-1 md:col-span-5 row-start-5 md:row-start-4 row-end-13 m-4 md:m-12 justify-self-center">
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
                    This post doesn't have any comments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* New input box for adding a comment */}
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

    </div>
  );

}
