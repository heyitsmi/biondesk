"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const statusCode = searchParams.get("status_code");
  const transactionStatus = searchParams.get("transaction_status");

  // Determine if it was canceled or failed
  const isCanceled = transactionStatus === "cancel" || transactionStatus === "expire"; // 'expire' might also be considered failed/canceled in this context

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-card max-w-md w-full text-center space-y-6 animate-fade-in-up">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
          <i className="ph-fill ph-x-circle text-4xl"></i>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            {isCanceled ? "Payment Canceled" : "Payment Failed"}
          </h1>
          <p className="text-slate-500">
            {isCanceled
              ? "You canceled the payment. No charges were made."
              : "We couldn't process your payment. Please try again or use a different payment method."}
          </p>
        </div>

        {orderId && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
            <p className="text-slate-500 mb-1">Order ID</p>
            <p className="font-mono font-medium text-slate-900">{orderId}</p>
          </div>
        )}

        <div className="pt-4 flex flex-col gap-3">
          <Link
            href="/settings/billing"
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Try Again
          </Link>
          <Link
            href="/dashboard"
            className="w-full py-3 bg-white text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
