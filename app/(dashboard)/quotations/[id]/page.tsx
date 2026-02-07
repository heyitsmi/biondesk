"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { quotesApi } from "@/lib/api";
import { DocumentWithItems } from "@/lib/types";
import { useReactToPrint } from "react-to-print";

export default function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [quote, setQuote] = useState<DocumentWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    if (!quote?.public_token) {
      alert("This quote does not have a public link generated yet.");
      return;
    }
    const url = `${window.location.origin}/quote/${quote.public_token}`;
    navigator.clipboard.writeText(url);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: quote ? `Quote ${quote.number}` : "Quote",
  });

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const data = await quotesApi.get(id);
        setQuote(data);
      } catch (error) {
        console.error("Error fetching quote:", error);
        alert("Failed to load quote details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuote();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "sent":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "viewed":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "overdue":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50">
        {/* Header Skeleton */}
        <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="space-y-1">
              <div className="w-20 h-3 bg-slate-200 rounded animate-pulse"></div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-5 bg-slate-200 rounded animate-pulse"></div>
                <div className="w-16 h-5 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-24 h-9 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="w-24 h-9 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>
        </header>
        {/* Body Skeleton */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 p-8 flex justify-center overflow-y-auto">
            <div className="w-full max-w-[210mm] aspect-[210/297] bg-white border border-slate-200 shadow-sm p-12 space-y-8">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="w-32 h-6 bg-slate-200 rounded animate-pulse"></div>
                  <div className="w-48 h-4 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2 flex flex-col items-end">
                  <div className="w-40 h-8 bg-slate-200 rounded animate-pulse"></div>
                  <div className="w-32 h-4 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                <div className="space-y-2">
                  <div className="w-24 h-3 bg-slate-200 rounded animate-pulse"></div>
                  <div className="w-40 h-5 bg-slate-200 rounded animate-pulse"></div>
                  <div className="w-32 h-4 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2 flex flex-col items-end">
                  <div className="w-24 h-3 bg-slate-200 rounded animate-pulse"></div>
                  <div className="w-40 h-5 bg-slate-200 rounded animate-pulse"></div>
                  <div className="w-32 h-4 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="w-full h-8 bg-slate-100 rounded animate-pulse"></div>
                <div className="w-full h-16 bg-slate-50 rounded animate-pulse"></div>
                <div className="w-full h-16 bg-slate-50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="w-[360px] border-l border-slate-200 bg-white p-6 space-y-6">
            <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-8 text-center text-slate-500">Quote not found</div>
    );
  }

  // Calculations if not present directly (though API should provide them, robust fallback)
  const subtotal =
    quote.items?.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0,
    ) || 0;
  // Assuming discount/tax/total stored in quote are correct.
  // If quote.amount is total, we display that.

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50 transition-all duration-300 ease-in-out">
      {/* Header */}
      <header className="h-16 px-8 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <i className="ph-bold ph-arrow-left text-lg"></i>
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <div className="flex items-center gap-2 text-xs font-[500] text-slate-500 mb-0.5">
              <span>Quotations</span>
              <i className="ph-bold ph-caret-right text-[10px] text-slate-300"></i>
              <span className="text-slate-800">{quote.number}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-[600] text-slate-900 tracking-tight leading-none">
                {quote.title}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5 capitalize ${getStatusBadge(quote.status)}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${quote.status === "sent" ? "bg-indigo-500" : "bg-current"}`}
                ></div>{" "}
                {quote.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/quotations/${id}/edit`}
            className="px-4 py-2 text-sm font-[550] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2"
          >
            <i className="ph-bold ph-pencil-simple"></i> Edit
          </Link>
          <div className="h-8 w-px bg-slate-200"></div>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 text-sm font-[550] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all relative"
            title="Copy Public Link"
          >
            <i className="ph-bold ph-link"></i>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-sm font-[550] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all"
            title="Download PDF"
          >
            <i className="ph-bold ph-download-simple"></i>
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-[550] shadow-subtle flex items-center gap-2 transition-smooth">
            <i className="ph-bold ph-paper-plane-tilt"></i>
            <span>Resend</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-20 right-8 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium animate-fade-in-up">
          <i className="ph-fill ph-check-circle text-emerald-400"></i>
          Public link copied to clipboard!
        </div>
      )}

      {/* Main Workspace (Split View) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: Document Preview (65%) */}
        <div className="flex-1 overflow-y-auto p-8 scroller-thin flex justify-center">
          {/* A4 Paper Representation */}
          <div
            ref={printRef}
            className="w-full max-w-[210mm] bg-white shadow-paper border border-slate-200 min-h-[297mm] p-12 text-slate-800 text-sm leading-relaxed relative print:shadow-none print:border-none print:m-0 print:p-8"
          >
            {/* Document Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4 text-indigo-600">
                  <i className="ph-fill ph-lightning text-2xl"></i>
                  <span className="text-xl font-bold text-slate-900">
                    Biondesk.
                  </span>
                </div>
                <p className="text-slate-500">
                  123 Creative Studio, Tech City
                  <br />
                  Jakarta, Indonesia 12345
                </p>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  QUOTATION
                </h1>
                <p className="text-slate-500">#{quote.number}</p>
                <p className="text-slate-500 mt-1">
                  Date: {new Date(quote.created_at).toLocaleDateString()}
                </p>
                <p className="text-slate-500">
                  Valid Until:{" "}
                  {quote.valid_until
                    ? new Date(quote.valid_until).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Client Info */}
            <div className="mb-12 pb-8 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                Prepared For
              </p>
              <h3 className="text-lg font-bold text-slate-900">
                {quote.contact?.name || "Unknown Client"}
              </h3>
              <p className="text-slate-600">{quote.contact?.company}</p>
              <p className="text-slate-500">{quote.contact?.email}</p>
            </div>

            {/* Line Items */}
            <div className="mb-12">
              <table className="w-full text-left">
                <thead className="border-b-2 border-slate-100">
                  <tr>
                    <th className="py-3 font-semibold text-slate-900 w-[50%]">
                      Description
                    </th>
                    <th className="py-3 font-semibold text-slate-900 w-[15%] text-right">
                      Qty
                    </th>
                    <th className="py-3 font-semibold text-slate-900 w-[15%] text-right">
                      Rate
                    </th>
                    <th className="py-3 font-semibold text-slate-900 w-[20%] text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quote.items?.map((item) => {
                    const parts = (item.description || "").split("\n");
                    const title = parts[0];
                    const desc = parts.slice(1).join("\n");
                    return (
                      <tr key={item.id}>
                        <td className="py-4 align-top">
                          <p className="font-medium text-slate-900">{title}</p>
                          {desc && (
                            <p className="text-slate-500 text-xs mt-1 whitespace-pre-line">
                              {desc}
                            </p>
                          )}
                        </td>
                        <td className="py-4 align-top text-right text-slate-600">
                          {item.quantity}
                        </td>
                        <td className="py-4 align-top text-right text-slate-600">
                          ${item.unit_price.toFixed(2)}
                        </td>
                        <td className="py-4 align-top text-right text-slate-900 font-medium">
                          ${(item.quantity * item.unit_price).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {quote.discount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Discount</span>
                    <span className="text-rose-500">
                      -${quote.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                {quote.tax > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span>${quote.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="h-px bg-slate-200 my-2"></div>
                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>${quote.amount.toFixed(2)}</span>
                </div>
                {quote.deposit > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-indigo-700 mt-2">
                    <span>Deposit Required</span>
                    <span>${quote.deposit.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {quote.notes && (
              <div className="pt-8 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Terms & Notes
                </p>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {quote.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Activity & Status (35%) */}
        <div className="w-[360px] bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto">
          {/* Status Timeline */}
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-[600] text-slate-900 mb-4">
              Document Status
            </h3>

            <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
              {/* Created */}
              <div className="relative">
                <div className="absolute -left-[21px] w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-sm"></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    Created
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(quote.created_at).toLocaleString()} by You
                  </span>
                </div>
              </div>

              {/* Sent (Conditional) */}
              {(quote.status === "sent" ||
                quote.status === "viewed" ||
                quote.status === "accepted") && (
                <div className="relative">
                  <div className="absolute -left-[21px] w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-sm"></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      Sent
                    </span>
                    <span className="text-xs text-slate-500">
                      Jan 14, 10:23 AM via Email
                    </span>
                  </div>
                </div>
              )}

              {/* Accepted (Conditional) */}
              {quote.status === "accepted" ? (
                <div className="relative">
                  <div className="absolute -left-[21px] w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-sm"></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-indigo-600 uppercase">
                      Accepted
                    </span>
                    <span className="text-xs text-slate-500">
                      Jan 15, 02:00 PM by Client
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative opacity-50">
                  <div className="absolute -left-[21px] w-3 h-3 bg-slate-200 rounded-full border-2 border-white"></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Accepted
                    </span>
                    <span className="text-xs text-slate-400">
                      Pending action
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Client Card */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-[600] text-slate-900">
                Client Details
              </h3>
              <Link
                href={`/contacts`}
                className="text-xs text-indigo-600 hover:underline"
              >
                View Profile
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                {(quote.contact?.name || "??").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-[600] text-slate-900">
                  {quote.contact?.name || "Unknown"}
                </p>
                <p className="text-xs text-slate-500">{quote.contact?.email}</p>
              </div>
            </div>
          </div>

          {/* Next Steps / Actions */}
          <div className="p-6 bg-slate-50/50 flex-1">
            <h3 className="text-sm font-[600] text-slate-900 mb-3">
              Next Steps
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl shadow-sm transition-all flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <i className="ph-bold ph-receipt"></i>
                </div>
                <div>
                  <p className="text-sm font-[600] text-slate-700 group-hover:text-indigo-700">
                    Convert to Invoice
                  </p>
                  <p className="text-[10px] text-slate-500">
                    If quote is accepted
                  </p>
                </div>
              </button>

              <button className="w-full text-left p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl shadow-sm transition-all flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <i className="ph-bold ph-bell-ringing"></i>
                </div>
                <div>
                  <p className="text-sm font-[600] text-slate-700 group-hover:text-indigo-700">
                    Send Follow-up
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Nudge the client gently
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
