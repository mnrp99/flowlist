"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatRupiah } from "@/utils/format";
import {
  Flame,
  Frown,
  Search,
  ArrowUpDown,
  Lightbulb,
  Quote,
  Share2,
  Calendar,
  AlertOctagon,
  Sparkles,
} from "lucide-react";

export const InsightsScreen: React.FC = () => {
  const { transactions } = useApp();

  const [activeTab, setActiveTab] = useState<"favorites" | "blacklist">("favorites");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate totals from transactions
  const worthItTransactions = transactions.filter(
    (tx) => tx.type === "expense" && tx.rating === "worth-it"
  );
  const regretTransactions = transactions.filter(
    (tx) => tx.type === "expense" && tx.rating === "regret"
  );

  const totalWorthIt = worthItTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalRegret = regretTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const regretPercentage =
    totalExpenses > 0 ? Math.round((totalRegret / totalExpenses) * 100) : 0;

  // Filter list based on search and activeTab
  const currentList =
    activeTab === "favorites" ? worthItTransactions : regretTransactions;

  const filteredList = currentList.filter(
    (tx) =>
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* 1. SCREEN HEADER & PERIOD NAVIGATOR */}
      <section className="flex flex-col space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              WorthIt Insights
            </h1>
            <p className="text-xs text-slate-500">
              Reflect on past spending to spend smarter
            </p>
          </div>

          <button
            type="button"
            aria-label="Export Insights"
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all shadow-xs"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Month Selector & Mindful Score Pill Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>November 2024</span>
          </div>

          {/* Mindful Health Score Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-extrabold text-emerald-700">
              82% Mindful Score
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">(+14%)</span>
          </div>
        </div>
      </section>

      {/* 2. DUAL STAT METRIC HIGHLIGHTS BENTO GRID */}
      <section className="grid grid-cols-2 gap-3">
        {/* Regret Metric Card */}
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex flex-col justify-between shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Regrets
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-white text-rose-700 text-[10px] font-extrabold shadow-2xs">
              {regretPercentage}% spend
            </span>
          </div>
          <div>
            <p className="text-lg font-extrabold text-rose-700 tracking-tight tabular-nums">
              {formatRupiah(totalRegret)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {regretTransactions.length} purchases regretted
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-rose-200/60 flex items-center gap-1 text-rose-700">
            <Frown className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">❌ Never Again</span>
          </div>
        </div>

        {/* High Value / Worth It Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col justify-between shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              High Value
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-white text-emerald-700 text-[10px] font-extrabold shadow-2xs">
              Top ROI
            </span>
          </div>
          <div>
            <p className="text-lg font-extrabold text-emerald-700 tracking-tight tabular-nums">
              {formatRupiah(totalWorthIt)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {worthItTransactions.length} places & items
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center gap-1 text-emerald-700">
            <Flame className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-bold">Worth every rupiah</span>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE FILTER SEGMENT CONTROL */}
      <section className="flex flex-col space-y-3">
        {/* Tab Controls with Pill Slider Style */}
        <div className="p-1 rounded-2xl bg-slate-100 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "favorites"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Flame className="w-4 h-4 text-emerald-600" />
            <span>My Favorites</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {worthItTransactions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("blacklist")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "blacklist"
                ? "bg-white text-rose-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>Blacklist</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
              {regretTransactions.length}
            </span>
          </button>
        </div>

        {/* Micro Search & Sort Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-9 px-3 rounded-full bg-white border border-slate-200/70 flex items-center gap-2 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiences, items..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="h-9 px-3 rounded-full bg-white border border-slate-200/70 flex items-center gap-1 text-slate-600 text-xs font-semibold shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Recent</span>
          </div>
        </div>
      </section>

      {/* 4. ITEMS FEED */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {activeTab === "favorites"
              ? "Verified High-Value List"
              : "Regret History (Lessons Learned)"}
          </span>
          <span
            className={`text-xs font-extrabold tabular-nums ${
              activeTab === "favorites" ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            Total: {formatRupiah(activeTab === "favorites" ? totalWorthIt : totalRegret)}
          </span>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 text-xs text-slate-500">
            No items in this category yet. Rate more expenses as &apos;Again!&apos; or &apos;Never Again&apos; to populate your insights.
          </div>
        ) : (
          filteredList.map((tx) => (
            <article
              key={tx.id}
              className={`p-3.5 rounded-2xl bg-white border shadow-xs flex flex-col space-y-2.5 transition-all hover:shadow-sm ${
                activeTab === "blacklist"
                  ? "border-rose-200/70 bg-gradient-to-br from-rose-50/20 to-white"
                  : "border-slate-100"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      activeTab === "favorites"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {activeTab === "favorites" ? (
                      <Flame className="w-5 h-5" />
                    ) : (
                      <AlertOctagon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {tx.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {tx.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{tx.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span
                    className={`text-xs font-extrabold tabular-nums ${
                      activeTab === "favorites" ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {formatRupiah(tx.amount)}
                  </span>
                  <div
                    className={`mt-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === "favorites"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : "bg-rose-50 text-rose-700 border border-rose-200/60"
                    }`}
                  >
                    <span>{activeTab === "favorites" ? "🔥 Again!" : "❌ Never Again"}</span>
                  </div>
                </div>
              </div>

              {/* Reflection Quote Box */}
              {tx.reflection && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col space-y-1">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Quote className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      User Reflection
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    &ldquo;{tx.reflection}&rdquo;
                  </p>
                  {tx.lesson && (
                    <div className="pt-1.5 mt-1 border-t border-slate-200/60 flex items-start gap-1 text-[11px] text-amber-800">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-bold text-slate-800">Lesson:</strong>{" "}
                        {tx.lesson}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))
        )}
      </section>

      {/* 5. ACTIONABLE FLOW RECOMMENDATION BANNER */}
      <section className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-slate-50 border border-emerald-300/40 shadow-xs flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 text-white shadow-sm">
          <Lightbulb className="w-5 h-5 text-emerald-100" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
            Flow Recommendation
          </h4>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            You save ~<strong className="font-bold text-slate-800">Rp 600.000/month</strong>{" "}
            when moving dining plans into Drafts first before going. Keep the streak going!
          </p>
        </div>
      </section>
    </div>
  );
};
