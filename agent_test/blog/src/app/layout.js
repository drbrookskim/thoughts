import './globals.css';
import Header from '@/components/Header';

export const metadata = {
    title: 'Technical Blog',
    description: 'A blog about programming and technology',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    {children}
                </main>
                <footer className="border-t border-gray-200 dark:border-slate-800 py-6 text-center text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} Technical Blog. All rights reserved.</p>
                </footer>
            </body>
        </html>
    );
}
