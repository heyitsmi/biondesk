"use client";

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                {/* Illustration */}
                <div className="mb-8 relative">
                    <div className="w-32 h-32 mx-auto bg-rose-100 rounded-full flex items-center justify-center">
                        <i className="ph ph-warning-circle text-6xl text-rose-500"></i>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Error
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-2xl font-[700] text-slate-900 mb-2">Something went wrong</h1>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    We encountered an unexpected error while processing your request. 
                    Don&apos;t worry, our team has been notified.
                </p>

                {/* Error Details (Dev Mode) */}
                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className="mb-6 p-4 bg-slate-100 rounded-lg text-left">
                        <p className="text-xs font-mono text-rose-600 break-all">{error.message}</p>
                        {error.digest && (
                            <p className="text-xs text-slate-400 mt-2">Digest: {error.digest}</p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={reset}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-[600] rounded-lg hover:border-slate-300 transition-all"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/dashboard"
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-[600] rounded-lg shadow-lg shadow-indigo-200 transition-all"
                    >
                        Go to Dashboard
                    </Link>
                </div>

                {/* Help Link */}
                <p className="mt-8 text-xs text-slate-400">
                    Persistent issue? <Link href="/support" className="text-indigo-600 hover:text-indigo-700 font-[500]">Contact Support</Link>
                </p>
            </div>
        </div>
    );
}
