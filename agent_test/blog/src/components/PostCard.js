import Link from 'next/link';
import { format } from 'date-fns';

export default function PostCard({ post }) {
    return (
        <div className="card h-full flex flex-col">
            <div className="mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                </span>
            </div>

            <Link href={`/posts/${post.id}`} className="block group">
                <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0">
                    {post.title}
                </h2>
            </Link>

            <p className="text-gray-600 dark:text-gray-300 flex-grow mb-4">
                {post.description}
            </p>

            <div className="mt-auto">
                <Link href={`/posts/${post.id}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center">
                    Read more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
