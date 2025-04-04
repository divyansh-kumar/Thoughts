'use client';

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
    tag: "",
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUid = sessionStorage.getItem("userID");
    setUid(storedUid);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please select an image.");
      return;
    }
    if (!uid) {
      alert("User not authenticated. Please login.");
      router.push("/login");
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append("file", formData.image);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }
      const { imageUrl } = await uploadResponse.json();

      const postResponse = await fetch("/api/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl,
          userId: uid,
          tags: formData.tag ? [formData.tag] : [],
        }),
      });
      if (!postResponse.ok) {
        throw new Error("Failed to create post");
      }
      alert("Post created successfully!");
      router.push("/home");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post.");
    }
  };

  const handleFileChange = (file: File) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileChange(file);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <section className="w-full max-w-4xl bg-white rounded-xl shadow-md dark:bg-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-6">
          Create New Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">
                Image
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput")?.click()}
                className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileChange(e.target.files[0])
                  }
                  className="hidden"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  {formData.image
                    ? formData.image.name
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  PNG, JPG, JPEG up to 10MB
                </p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring h-32"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">
              Tag
            </label>
            <input
              type="text"
              value={formData.tag}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tag: e.target.value }))
              }
              placeholder="Enter a tag"
              className="block w-full px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            >
              Create Post
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}