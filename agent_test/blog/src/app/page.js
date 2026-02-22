import { getSortedPostsData } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export default function Home() {
    const allPostsData = getSortedPostsData();

    return (
        <div className="max-w-4xl mx-auto">
            <section className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    Welcome to TechBlog
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Exploring the latest in web development, software engineering, and technology trends.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6 border-b pb-2 border-gray-200 dark:border-gray-700">
                    Recent Posts
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {allPostsData.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </section>
        </div>
    );
}
