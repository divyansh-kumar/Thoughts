import Link from "next/link";

export default function TopBar() {
  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Public Posts
        </h1>
        <div className="flex space-x-4 items-center">
          <Link
            href="/create"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Post
          </Link>
          
          </div>
      </div>
    </div>
  );
}



