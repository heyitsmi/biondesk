"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { opportunitiesApi } from "@/lib/api";
import { Opportunity, OpportunitySource, Priority } from "@/lib/types";
import CountrySelect from "@/components/CountrySelect";

export default function EditOpportunityPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    source: OpportunitySource;
    client_name: string;
    job_link: string;
    value: string;
    budget_type: "fixed" | "hourly" | "tbd";
    priority: Priority;
    description: string;
    notes: string;
    stage: string; // Keep track of stage
    country_code: string;
  }>({
    title: "",
    source: "direct",
    client_name: "",
    job_link: "",
    value: "",
    budget_type: "fixed",
    priority: "medium",
    description: "",
    notes: "",

    stage: "inbox",
    country_code: "US",
  });

  useEffect(() => {
    if (!id) return;

    async function fetchOpportunity() {
      try {
        const data = await opportunitiesApi.get(id);
        setFormData({
          title: data.title || "",
          source: data.source || "direct",
          client_name: data.client_name || "",
          job_link: data.job_link || "",
          value: data.value ? String(data.value) : "",
          budget_type: data.budget_type || "fixed",
          priority: data.priority || "medium",
          description: data.description || "",
          notes: data.notes || "",
          stage: data.stage,
          country_code: data.country_code || "US",
        });
      } catch (error) {
        console.error("Failed to fetch opportunity:", error);
        alert("Could not load opportunity.");
        router.push("/opportunities");
      } finally {
        setIsFetching(false);
      }
    }

    fetchOpportunity();
  }, [id, router]);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;

      // Set description immediately whether we extract or not
      setFormData((prev) => ({ ...prev, description: text }));

      if (
        !confirm(
          "Do you want to extract details from this text? This might overwrite existing fields.",
        )
      ) {
        return;
      }

      // Call AI extraction
      setIsAiLoading(true);
      const response = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text }),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          description: text,
          title: data.title || prev.title,
          client_name: data.client_name || prev.client_name,
          value: data.budget
            ? String(data.budget).replace(/[^0-9.]/g, "")
            : prev.value,
          budget_type: (["fixed", "hourly", "tbd"].includes(data.budget_type)
            ? data.budget_type
            : prev.budget_type) as any,
          priority: (["low", "medium", "high"].includes(data.priority)
            ? data.priority
            : prev.priority) as any,
          source: (["upwork", "linkedin", "email", "direct", "other"].includes(
            data.source,
          )
            ? data.source
            : prev.source) as any,
          country_code: data.country_code || prev.country_code,
        }));
      }
    } catch (error) {
      console.error("Failed to paste or extract:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await opportunitiesApi.update(id, {
        title: formData.title,
        source: formData.source,
        client_name: formData.client_name || null,
        job_link: formData.job_link || null,
        value: formData.value ? parseFloat(formData.value) : null,
        budget_type: formData.budget_type,
        priority: formData.priority,
        description: formData.description || null,
        notes: formData.notes || null,
        country_code: formData.country_code || null,
        // We don't update stage here unless we add a dropdown, but usually stage is managed in board
      });

      router.push("/opportunities");
    } catch (error) {
      console.error("Error updating opportunity:", error);
      alert("Failed to update opportunity.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <i className="ph-bold ph-spinner animate-spin text-2xl text-indigo-600"></i>
          <p className="text-sm text-slate-500">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50 transition-all duration-300 ease-in-out">
      {/* Header */}
      <header className="h-auto md:h-16 px-4 md:px-8 py-4 md:py-0 flex flex-col md:flex-row items-start md:items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 shrink-0 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <i className="ph-bold ph-arrow-left text-lg"></i>
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-[500] text-slate-500 mb-0.5">
              <span>Opportunities</span>
              <i className="ph-bold ph-caret-right text-[10px] text-slate-300"></i>
              <span className="text-slate-800">Edit</span>
            </div>
            <h1 className="text-lg font-[600] text-slate-900 tracking-tight leading-none truncate">
              Edit {formData.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            href={`/proposals/generate?opportunityId=${id}`}
            className="flex-1 md:flex-none justify-center px-4 py-2 text-sm font-[550] text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 hover:border-indigo-200 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ph-bold ph-magic-wand"></i> Generate Proposal
          </Link>
          <Link
            href="/opportunities"
            className="flex-1 md:flex-none text-center px-4 py-2 text-sm font-[550] text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.title}
            className="order-first md:order-last w-full md:w-auto justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-[550] shadow-sm flex items-center gap-2 transition-all"
          >
            <i className="ph-bold ph-check"></i>
            <span>{isLoading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </header>

      {/* Form Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Basic Info */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Title */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-sm font-[600] text-slate-700">
                    Project Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Redesign Landing Page for SaaS"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                {/* Source / Platform */}
                <div className="space-y-1.5">
                  <label className="text-sm font-[600] text-slate-700">
                    Source
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                      value={formData.source}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          source: e.target.value as OpportunitySource,
                        }))
                      }
                    >
                      <option value="upwork">Upwork</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="email">Email Inquiry</option>
                      <option value="direct">Direct Client</option>
                      <option value="other">Other</option>
                    </select>
                    <i className="ph-bold ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                  </div>
                </div>

                {/* Client Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-[600] text-slate-700">
                    Client Name{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Inc."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    value={formData.client_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        client_name: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Country */}
                <div className="space-y-1.5">
                  <label className="text-sm font-[600] text-slate-700">
                    Country
                  </label>
                  <CountrySelect
                    value={formData.country_code}
                    onChange={(code) =>
                      setFormData((prev) => ({ ...prev, country_code: code }))
                    }
                  />
                </div>

                {/* Link */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-sm font-[600] text-slate-700">
                    Job Link / URL
                  </label>
                  <div className="relative">
                    <i className="ph ph-link absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                    <input
                      type="url"
                      placeholder="https://..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                      value={formData.job_link}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          job_link: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Details & Tags */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Budget */}
                <div className="space-y-1.5">
                  <label className="text-sm font-[600] text-slate-700">
                    Budget Estimate
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-sm font-[600] text-slate-700">
                    Type
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                      value={formData.budget_type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          budget_type: e.target.value as any,
                        }))
                      }
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="hourly">Hourly Rate</option>
                      <option value="tbd">TBD</option>
                    </select>
                    <i className="ph-bold ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                  </div>
                </div>

                {/* Urgency */}
                <div className="space-y-1.5">
                  <label className="text-sm font-[600] text-slate-700">
                    Priority / Urgency
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: e.target.value as Priority,
                        }))
                      }
                    >
                      <option value="medium">Normal</option>
                      <option value="high">High Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                    <i className="ph-bold ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Job Description (AI) */}
            <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-[600] text-slate-700">
                  Job Description / Brief
                </label>
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="text-xs font-[600] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                >
                  <i className="ph-bold ph-clipboard-text"></i>
                  {isAiLoading ? "Extracting..." : "Paste from Clipboard"}
                </button>
              </div>
              <div className="relative">
                <textarea
                  rows={10}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-[450] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-y"
                  placeholder="Paste the entire job post here. This will be used by AI to generate your proposal..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                ></textarea>
                {isAiLoading && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                    <div className="flex flex-col items-center gap-2">
                      <i className="ph-bold ph-spinner animate-spin text-2xl text-indigo-600"></i>
                      <span className="text-xs font-medium text-indigo-600">
                        Analyzing job post...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-[600] text-slate-900">
                  Internal Notes
                </h2>
              </div>
              <div className="p-4 md:p-6">
                <textarea
                  rows={4}
                  placeholder="Any additional notes for yourself..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                ></textarea>
              </div>
            </div>

            {/* CTA Bar */}
            <div className="flex items-center justify-end gap-4 pt-4 pb-12">
              <button
                type="submit"
                disabled={isLoading || !formData.title}
                className="w-full md:w-auto group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-[600] text-white transition-all duration-200 bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <i className="ph-bold ph-floppy-disk text-lg text-indigo-300"></i>
                  {isLoading ? "Saving..." : "Save Changes"}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-12 mb-6 text-center">
          <p className="text-xs text-slate-400">
            © 2026 Biondesk. Crafted for growth.
          </p>
        </div>
      </div>
    </main>
  );
}
