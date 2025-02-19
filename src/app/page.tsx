import Image from "next/image";
import TopBar from "@/components/TopBar";

const API_BASE_URL = "http://localhost:3000/api";
const IMAGE_BASE_URL = "https://s3.us-east-005.backblazeb2.com/divyansh-testing";

async function getPosts() {
  const res = await fetch(`${API_BASE_URL}/get-post`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  return res.json();
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {posts?.map((post: any) => (
            <div
              key={post.created_at}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {post.description}
              </p>

              {post.image_url && (
                <div className="relative w-full mb-4 rounded-lg overflow-hidden h-screen flex items-center justify-center">
                  <Image
                  src={`${IMAGE_BASE_URL}${post.image_url}`}
                  alt={post.title}
                  width={400} 
                  height={300}
                  className="rounded-lg object-cover "
                />
                </div>
              )}

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Posted on {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}




//following and tags