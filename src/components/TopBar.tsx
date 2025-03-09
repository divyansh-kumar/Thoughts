import Link from "next/link";
import { Router } from "next/router";

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function TopBar({ searchQuery, setSearchQuery }: TopBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Public Posts
        </h1>
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={handleInputChange}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <Link
            href="/create"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Post
          </Link>
          <a href="/profile">
            <img className="object-cover w-6 h-6 rounded-full cursor-pointer" src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40&q=100" alt="Profile Picture" />
          </a>

        </div>
      </div>
    </div>
  );
}
