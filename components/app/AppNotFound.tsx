import Link from 'next/link';

export default function AppNotFound() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                {/* Illustration */}
                <div className="mb-8 relative">
                    <div className="w-32 h-32 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
                        <i className="ph ph-compass text-6xl text-indigo-500"></i>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        404
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-2xl font-[700] text-slate-900 mb-2">Page Not Found</h1>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved. 
                    Let&apos;s get you back on track.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-[600] rounded-lg shadow-lg shadow-indigo-200 transition-all"
                    >
                        Go to Dashboard
                    </Link>
                </div>

                {/* Help Link */}
                <p className="mt-8 text-xs text-slate-400">
                    Need help? <Link href="/support" className="text-indigo-600 hover:text-indigo-700 font-[500]">Contact Support</Link>
                </p>
            </div>
        </div>
    );
}
