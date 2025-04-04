"use client";
import { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL, PostCard } from "@/components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  useAuth();

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

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Pass searchQuery and its setter to TopBar */}
      <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-center text-xl text-gray-700 dark:text-gray-200">
            No posts found for tag &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>
    </main>
  );
}
