"use client";

import { useState, useEffect, use, useRef } from "react";
import { publicApi } from "@/lib/api";
import { DocumentWithItems } from "@/lib/types";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";

export default function PublicQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [quote, setQuote] = useState<DocumentWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Canvas Helper Functions
  const getCoordinates = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize canvas if needed to match display size for better resolution (optional, keeping simple for now)
    if (
      canvas.width !== canvas.offsetWidth ||
      canvas.height !== canvas.offsetHeight
    ) {
      // Saving context state if needed, but for simple signature, reset is okay or better:
      // set canvas dims once. For now, rely on CSS sizing but this might cause blurriness.
      // To fix blurriness:
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Prevent scrolling on touch
    if ("touches" in e) {
      // e.preventDefault(); // Might need passive: false listener if we want to prevent default
    }

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureData(null);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: quote ? `Quote ${quote.number}` : "Quote",
  });

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        // Determine if we are using UUID or a specific public token.
        // For this implementation, we assume the URL parameter is usable as the lookup token/ID.
        const data = await publicApi.getDocument(id);
        setQuote(data);
        if (data.status === "accepted") {
          setIsAccepted(true);
        }
      } catch (error) {
        console.error("Error fetching public quote:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuote();
  }, [id]);

  const handleAccept = async () => {
    if (!signatureName.trim()) {
      alert("Please enter your full name to sign.");
      return;
    }
    if (!signatureData) {
      alert("Please sign the document.");
      return;
    }

    setIsSigning(true);
    try {
      await publicApi.acceptQuote(id, {
        signature_name: signatureName,
        signature: signatureData,
      });
      setIsAccepted(true);
      setIsSignatureModalOpen(false);
    } catch (error) {
      console.error("Failed to accept quote:", error);
      alert("Failed to accept quote. Please try again.");
    } finally {
      setIsSigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="font-sans antialiased text-slate-900 min-h-screen flex flex-col bg-slate-100">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm h-16 shrink-0" />
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <div className="bg-white shadow-paper rounded-sm border border-slate-200 aspect-[210/297] p-12 space-y-8 animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-3">
                  <div className="w-32 h-8 bg-slate-200 rounded"></div>
                  <div className="w-48 h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="space-y-3 flex flex-col items-end">
                  <div className="w-40 h-8 bg-slate-200 rounded"></div>
                  <div className="w-32 h-4 bg-slate-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="w-full h-8 bg-slate-100 rounded"></div>
                <div className="w-full h-32 bg-slate-50 rounded"></div>
              </div>
            </div>
          </div>
          <div className="lg:w-[360px] flex-shrink-0 space-y-6">
            <div className="bg-white rounded-2xl p-6 h-64 animate-pulse"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 flex-col gap-4">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
          <i className="ph-bold ph-file-x text-3xl"></i>
        </div>
        <h1 className="text-xl font-semibold text-slate-900">
          Quote not found
        </h1>
        <p className="text-slate-500">This link may be invalid or expired.</p>
      </div>
    );
  }

  // Calculations
  const subtotal =
    quote.items?.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0,
    ) || 0;
  // Assuming API provides calculated fields preferably, but falling back to simple calcs if needed.
  // We'll use quote.amount as Total.

  return (
    <div className="font-sans antialiased text-slate-900 min-h-screen flex flex-col bg-slate-100">
      {/* TOP BAR (Trust & Brand) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Freelancer Brand */}
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            {quote.workspace?.logo_url ? (
              <img
                src={quote.workspace.logo_url}
                alt={quote.workspace.name}
                className="w-8 h-8 rounded-lg object-contain bg-white"
              />
            ) : (
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <i className="ph-bold ph-lightning text-lg"></i>
              </div>
            )}
            <span className="text-lg font-[650] tracking-tight">
              {quote.workspace?.name || "Biondesk Studio"}
            </span>
          </div>

          {/* Trust Badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <i className="ph-fill ph-check-circle text-emerald-500"></i>
            Verified Proposal
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT: Quote Document */}
        <div className="flex-1 w-full animate-fade-in-up">
          {/* Expiry Warning (Mobile) */}
          {quote.valid_until &&
            new Date(quote.valid_until) < new Date() &&
            !isAccepted && (
              <div className="lg:hidden mb-6 bg-white border border-amber-100 rounded-xl p-4 shadow-sm flex items-center justify-between border-l-4 border-l-amber-500">
                <div>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                    Expired
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    Valid until{" "}
                    {new Date(quote.valid_until).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <i className="ph-fill ph-clock-countdown text-xl"></i>
                </div>
              </div>
            )}

          {/* Paper Document */}
          <div
            ref={printRef}
            className="bg-white shadow-paper rounded-sm border border-slate-200 min-h-[600px] sm:min-h-[800px] p-8 sm:p-12 relative overflow-hidden print:shadow-none print:border-none print:m-0 print:p-8"
          >
            {/* Quote Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-12 gap-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  QUOTATION
                </h1>
                <p className="text-slate-500 font-medium">{quote.number}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-slate-500">
                  Created: {new Date(quote.created_at).toLocaleDateString()}
                </p>
                {quote.valid_until && (
                  <p className="text-sm font-semibold text-amber-600">
                    Valid Until:{" "}
                    {new Date(quote.valid_until).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 pb-8 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Prepared By
                </p>
                <h3 className="font-bold text-slate-900">
                  {quote.workspace?.name || "Biondesk Studio"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {quote.workspace?.address || "Address not available"}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Prepared For
                </p>
                <h3 className="font-bold text-slate-900">
                  {quote.contact?.name || "Valued Client"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {quote.contact?.company && (
                    <>
                      {quote.contact.company}
                      <br />
                    </>
                  )}
                  {quote.contact?.email}
                </p>
              </div>
            </div>

            {/* Scope / Description */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                {quote.title}
              </h3>
              {quote.content && (
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {quote.content}
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="mb-12 overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
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
                <tbody className="divide-y divide-slate-100 text-sm">
                  {quote.items?.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 align-top">
                        <p className="font-medium text-slate-900">
                          {item.description?.split("\n")[0]}
                        </p>
                        {item.description?.split("\n").slice(1).join("\n") && (
                          <p className="text-slate-500 text-xs mt-1 whitespace-pre-line">
                            {item.description.split("\n").slice(1).join("\n")}
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-72 space-y-3">
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {quote.discount > 0 && (
                  <div className="flex justify-between text-slate-600 text-sm">
                    <span>Discount</span>
                    <span className="text-rose-500">
                      -${quote.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                {quote.tax > 0 && (
                  <div className="flex justify-between text-slate-600 text-sm">
                    <span>Tax</span>
                    <span>${quote.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="h-px bg-slate-200 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900">
                    Total Estimate
                  </span>
                  <span className="text-xl font-bold text-indigo-700">
                    ${quote.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms */}
            {quote.notes && (
              <div className="pt-8 border-t border-slate-100 text-sm">
                <p className="font-bold text-slate-900 mb-2">
                  Terms & Conditions
                </p>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                  {quote.notes}
                </p>
              </div>
            )}

            {/* Signature Display (if accepted) */}
            {isAccepted && quote.signature && (
              <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">
                  Authorized Signature
                </p>
                <div className="inline-block border text-center">
                  <img
                    src={quote.signature}
                    alt="Signature"
                    className="h-24 object-contain mb-2"
                  />
                  <div className="border-t border-slate-200 pt-1 text-xs text-slate-500 px-4 pb-2">
                    Accepted by{" "}
                    {quote.notes?.split("Signed by: ")[1] || "Client"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Action Panel (Sticky on Desktop) */}
        <div
          className="lg:w-[360px] flex-shrink-0 space-y-6 lg:sticky lg:top-24 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Approval Card */}
          <div className="bg-white border border-slate-200 shadow-floating rounded-2xl p-6 overflow-hidden relative">
            {!isAccepted ? (
              !isSignatureModalOpen ? (
                <>
                  <div className="mb-6">
                    <p className="text-sm text-slate-500 mb-1">
                      Total Project Value
                    </p>
                    <h2 className="text-3xl font-[700] text-slate-900">
                      ${quote.amount.toFixed(2)}
                    </h2>

                    {quote.valid_until && (
                      <div className="mt-3 flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-100">
                        <i className="ph-fill ph-clock-countdown"></i>
                        Valid until{" "}
                        {new Date(quote.valid_until).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setIsSignatureModalOpen(true)}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                    >
                      <i className="ph-bold ph-check"></i> Accept Quote
                    </button>

                    <button className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                      <i className="ph-bold ph-question"></i> Ask a Question
                    </button>
                  </div>
                </>
              ) : (
                <div className="animate-fade-in-up">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Sign to Accept
                  </h3>
                  <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      placeholder="e.g. Sarah Miller"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
                      Signature
                    </label>
                    <div className="relative bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg overflow-hidden h-32 hover:border-indigo-400 transition-colors">
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                      {!isDrawing && !signatureData && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-xs text-slate-400">
                            Draw signature here
                          </span>
                        </div>
                      )}
                      <button
                        onClick={clearSignature}
                        className="absolute top-2 right-2 p-1.5 bg-white shadow-sm rounded-md text-slate-400 hover:text-rose-500 transition-colors z-10"
                        title="Clear"
                      >
                        <i className="ph-bold ph-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsSignatureModalOpen(false)}
                      className="flex-1 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg border border-transparent"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAccept}
                      disabled={isSigning}
                      className="flex-1 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center justify-center gap-2"
                    >
                      {isSigning && (
                        <i className="ph-bold ph-spinner animate-spin"></i>
                      )}
                      Confirm
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center animate-fade-in-up">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600">
                  <i className="ph-fill ph-check text-2xl"></i>
                </div>
                <h3 className="text-emerald-800 font-bold">Quote Accepted!</h3>
                <p className="text-emerald-600 text-xs mt-1">
                  Thank you. The quote has been signed and accepted.
                </p>
              </div>
            )}
          </div>

          {/* Download Action */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4">
            <button
              onClick={() => handlePrint()}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <i className="ph-bold ph-download-simple"></i>
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Download PDF
                </span>
              </div>
              <i className="ph-bold ph-caret-right text-slate-300 group-hover:text-indigo-400"></i>
            </button>
          </div>

          {/* Footer Branding */}
          <div className="text-center">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              <i className="ph-fill ph-lightning"></i> Powered by Biondesk
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
