'use client';

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

function TagInput({ tags, onTagsChange }: { tags: string[]; onTagsChange: (tags: string[]) => void }) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();
      const newTags = inputValue
        .split(/[\s,]+/)
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

      if (newTags.length === 0) return;

      const updatedTags = [...tags];
      let errorMessage = "";

      for (const tag of newTags) {
        if (updatedTags.length >= 5) {
          errorMessage = "Maximum 5 tags allowed";
          break;
        }
        if (!updatedTags.includes(tag)) {
          updatedTags.push(tag);
        }
      }

      if (errorMessage) {
        setError(errorMessage);
      } else {
        setError("");
        onTagsChange(updatedTags);
        setInputValue("");
      }
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onTagsChange(newTags);
    setError("");
  };

  return (
    <div className="w-full">
      <label className="block text-sm text-gray-700 dark:text-gray-200 mb-2">
        Tags (separate with space)
      </label>
      
      <div className="flex flex-wrap items-center border border-gray-300 rounded-md p-2 dark:border-gray-600">
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm dark:bg-blue-900 dark:text-blue-300"
            >
              <span>{tag}</span>
              <button
                type="button"
                className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                onClick={() => removeTag(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags..."
          className="flex-1 border-none outline-none focus:ring-0 bg-transparent dark:text-gray-200 min-w-[120px]"
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
    tags: [] as string[],
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUid = localStorage.getItem("userID");
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
          tags: formData.tags,
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
            <TagInput 
              tags={formData.tags} 
              onTagsChange={(newTags) => setFormData(prev => ({ ...prev, tags: newTags }))} 
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