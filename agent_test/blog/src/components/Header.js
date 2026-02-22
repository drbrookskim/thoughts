import Link from 'next/link';

export default function Header() {
    return (
        <header className="border-b border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <img src="/logo.png" alt="TechBlog Logo" className="h-10 w-auto" />
                </Link>
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                                GitHub
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
