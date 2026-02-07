"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface AnalyticsData {
  quoteWinRate: number;
  totalQuotes: number;
  acceptedQuotes: number;
  paidRatio: number;
  totalInvoices: number;
  paidInvoices: number;
  avgTimeToPay: number;
  quoteStats: {
    sent: { count: number; val: number };
    viewed: { count: number; val: number };
    accepted: { count: number; val: number };
  };
  invoiceStats: {
    paid: { count: number; val: number };
    outstanding: { count: number; val: number };
    overdue: { count: number; val: number };
  };
  topServices: { name: string; value: number }[];
}

// Helper for currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AnalyticsView({ data }: { data: AnalyticsData }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Analytics Report - ${new Date().toLocaleDateString()}`,
  });

  return (
    <>
      {/* Header */}
      <header className="h-16 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 shrink-0 print:hidden">
        <h1 className="text-xl font-[600] text-slate-900 tracking-tight">
          Performance Analytics
        </h1>
        <div className="flex items-center gap-3">
          <select className="px-3 py-1.5 text-xs font-[500] text-slate-600 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 hover:bg-slate-50 cursor-pointer">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
          <button
            onClick={() => handlePrint()}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Download PDF"
          >
            <i className="ph-bold ph-download-simple text-lg"></i>
          </button>
        </div>
      </header>

      {/* Analytics Content */}
      <div
        className="flex-1 overflow-y-auto scroller-thin bg-slate-50/50"
        ref={contentRef}
      >
        <div className="p-8">
          {/* Print-only Header */}
          <div className="hidden print:block mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Performance Analytics Report
            </h1>
            <p className="text-sm text-slate-500">
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* 1. Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3">
              {/* Quote Win Rate */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between break-inside-avoid">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-[600] text-slate-400 uppercase tracking-wide">
                      Quote Win Rate
                    </p>
                    <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      +5%
                    </span>
                  </div>
                  <h2 className="text-3xl font-[700] text-slate-900">
                    {data.quoteWinRate}%
                  </h2>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-slate-100 rounded-full h-2 print:border print:border-slate-200">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-1000 print:bg-indigo-600 print-color-adjust-exact"
                      style={{ width: `${data.quoteWinRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {data.acceptedQuotes} accepted out of {data.totalQuotes}{" "}
                    sent
                  </p>
                </div>
              </div>

              {/* Invoice Paid Ratio */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between break-inside-avoid">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-[600] text-slate-400 uppercase tracking-wide">
                      Paid Ratio
                    </p>
                    <i className="ph-fill ph-check-circle text-emerald-400 text-xl text-emerald-500"></i>
                  </div>
                  <h2 className="text-3xl font-[700] text-slate-900">
                    {data.paidRatio}%
                  </h2>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-slate-100 rounded-full h-2 print:border print:border-slate-200">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 print:bg-emerald-600 print-color-adjust-exact"
                      style={{ width: `${data.paidRatio}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {data.paidInvoices} paid out of {data.totalInvoices}{" "}
                    invoices
                  </p>
                </div>
              </div>

              {/* Avg Time to Payment */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between break-inside-avoid">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-[600] text-slate-400 uppercase tracking-wide">
                      Avg. Time to Pay
                    </p>
                    <i className="ph-fill ph-clock text-amber-400 text-xl text-amber-500"></i>
                  </div>
                  <h2 className="text-3xl font-[700] text-slate-900">
                    {data.avgTimeToPay} Days
                  </h2>
                </div>
                <div className="mt-auto pt-4">
                  <p className="text-xs text-slate-500">
                    Faster than industry avg (14 days)
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Detailed Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-2">
              {/* Quotes Breakdown */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm break-inside-avoid">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-[600] text-slate-900">
                    Quotes Pipeline
                  </h3>
                  <span className="text-xs text-indigo-600 font-medium print:hidden">
                    View All
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Sent */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-600">Sent</span>
                      <span className="text-slate-500">
                        {data.quoteStats.sent.count} (
                        {formatCurrency(data.quoteStats.sent.val)})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 print:border print:border-slate-200">
                      <div
                        className="bg-indigo-400 h-2.5 rounded-full transition-all duration-1000 print:bg-indigo-400 print-color-adjust-exact"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Viewed */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-600">Viewed</span>
                      <span className="text-slate-500">
                        {data.quoteStats.viewed.count} (
                        {formatCurrency(data.quoteStats.viewed.val)})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 print:border print:border-slate-200">
                      <div
                        className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000 print:bg-indigo-500 print-color-adjust-exact"
                        style={{
                          width: `${data.quoteStats.sent.count > 0 ? (data.quoteStats.viewed.count / data.quoteStats.sent.count) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Accepted */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-600">
                        Accepted
                      </span>
                      <span className="text-slate-500">
                        {data.quoteStats.accepted.count} (
                        {formatCurrency(data.quoteStats.accepted.val)})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 print:border print:border-slate-200">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000 print:bg-emerald-500 print-color-adjust-exact"
                        style={{
                          width: `${data.quoteStats.sent.count > 0 ? (data.quoteStats.accepted.count / data.quoteStats.sent.count) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoices Breakdown */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm break-inside-avoid">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-[600] text-slate-900">
                    Invoice Status
                  </h3>
                  <span className="text-xs text-indigo-600 font-medium print:hidden">
                    View All
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Paid */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-600">Paid</span>
                      <span className="text-slate-500">
                        {data.invoiceStats.paid.count} (
                        {formatCurrency(data.invoiceStats.paid.val)})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 print:border print:border-slate-200">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000 print:bg-emerald-500 print-color-adjust-exact"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Outstanding */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-600">
                        Outstanding (Sent)
                      </span>
                      <span className="text-slate-500">
                        {data.invoiceStats.outstanding.count} (
                        {formatCurrency(data.invoiceStats.outstanding.val)})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 print:border print:border-slate-200">
                      <div
                        className="bg-indigo-400 h-2.5 rounded-full transition-all duration-1000 print:bg-indigo-400 print-color-adjust-exact"
                        style={{
                          width: `${data.invoiceStats.outstanding.count > 0 ? "50%" : "0%"}`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Overdue */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-600">
                        Overdue
                      </span>
                      <span className="text-slate-500">
                        {data.invoiceStats.overdue.count} (
                        {formatCurrency(data.invoiceStats.overdue.val)})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 print:border print:border-slate-200">
                      <div
                        className="bg-rose-500 h-2.5 rounded-full transition-all duration-1000 print:bg-rose-500 print-color-adjust-exact"
                        style={{
                          width: `${data.invoiceStats.overdue.count > 0 ? "25%" : "0%"}`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Top Services */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm break-inside-avoid">
              <h3 className="text-sm font-[600] text-slate-900 mb-6">
                Top Performing Services
              </h3>

              <div className="space-y-5">
                {data.topServices.length > 0 ? (
                  data.topServices.map((service, index) => {
                    const maxVal = data.topServices[0].value;
                    const percent = (service.value / maxVal) * 100;
                    const colors = [
                      {
                        bg: "bg-indigo-50",
                        text: "text-indigo-600",
                        bar: "bg-indigo-600",
                        icon: "ph-globe",
                      },
                      {
                        bg: "bg-purple-50",
                        text: "text-purple-600",
                        bar: "bg-purple-500",
                        icon: "ph-device-mobile",
                      },
                      {
                        bg: "bg-emerald-50",
                        text: "text-emerald-600",
                        bar: "bg-emerald-500",
                        icon: "ph-pencil-circle",
                      },
                      {
                        bg: "bg-amber-50",
                        text: "text-amber-600",
                        bar: "bg-amber-500",
                        icon: "ph-star",
                      },
                      {
                        bg: "bg-rose-50",
                        text: "text-rose-600",
                        bar: "bg-rose-500",
                        icon: "ph-heart",
                      },
                    ];
                    const theme = colors[index % colors.length];

                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg ${theme.bg} ${theme.text} flex items-center justify-center shrink-0`}
                        >
                          <i className={`ph-bold ${theme.icon} text-lg`}></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-[600] text-slate-900">
                              {service.name}
                            </span>
                            <span className="text-sm font-[600] text-slate-900">
                              {formatCurrency(service.value)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 print:border print:border-slate-200">
                            <div
                              className={`${theme.bar} h-2 rounded-full transition-all duration-1000 print-color-adjust-exact`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No service data available yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 mb-6 text-center print:hidden">
            <p className="text-xs text-slate-400">
              © 2026 Biondesk. Crafted for growth.
            </p>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print-color-adjust-exact {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}
