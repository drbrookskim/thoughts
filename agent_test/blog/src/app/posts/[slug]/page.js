import { getAllPostIds, getPostData } from '@/lib/posts';
import { format } from 'date-fns';
import Link from 'next/link';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    return paths;
}

export default async function Post({ params }) {
    const { slug } = await params;
    const postData = await getPostData(slug);

    return (
        <article className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
                    {postData.title}
                </h1>
                <div className="text-gray-500 dark:text-gray-400">
                    <time dateTime={postData.date}>
                        {format(new Date(postData.date), 'MMMM d, yyyy')}
                    </time>
                </div>
            </div>

            <div
                className="prose prose-lg dark:prose-invert mx-auto"
                dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
            />

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </article>
    );
}
