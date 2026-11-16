"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { formatRupiah } from "@/utils/format";
import {
  Flame,
  Frown,
  Search,
  Quote,
  Share2,
  Calendar,
  AlertOctagon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

export const InsightsScreen: React.FC = () => {
  const { transactions, t } = useApp();

  const [activeTab, setActiveTab] = useState<"favorites" | "blacklist">("favorites");
  const [searchQuery, setSearchQuery] = useState("");

  // Request 4: Dynamic Month & Year (defaults to current date e.g. November 2026)
  const now = useMemo(() => new Date(), []);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth()); // 0-indexed

  const monthNamesId = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const handleResetToCurrentMonth = () => {
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
  };

  const isCurrentMonth =
    selectedYear === now.getFullYear() && selectedMonth === now.getMonth();

  // Helper to test if a transaction belongs to the selected month & year
  const isTxInSelectedMonth = (txTime: string): boolean => {
    if (!txTime) return false;

    // Relative strings like "Hari ini", "Baru saja", "Kemarin" belong to current calendar month
    const lower = txTime.toLowerCase();
    if (
      lower.includes("hari ini") ||
      lower.includes("baru saja") ||
      lower.includes("kemarin") ||
      lower.includes("today")
    ) {
      return isCurrentMonth;
    }

    // Try standard JS Date parsing
    const parsed = new Date(txTime);
    if (!isNaN(parsed.getTime())) {
      return (
        parsed.getFullYear() === selectedYear &&
        parsed.getMonth() === selectedMonth
      );
    }

    // Try checking string match for year and month abbreviation or number
    const yearStr = selectedYear.toString();
    const monthNumStr = String(selectedMonth + 1).padStart(2, "0");
    if (txTime.includes(yearStr) && txTime.includes(`-${monthNumStr}-`)) {
      return true;
    }

    return false;
  };

  // Request 4: Filter transactions for the selected month so metrics reset per month
  const monthTransactions = useMemo(() => {
    return transactions.filter((tx) => isTxInSelectedMonth(tx.time));
  }, [transactions, selectedYear, selectedMonth, isCurrentMonth]);

  const monthExpenses = useMemo(() => {
    return monthTransactions.filter((tx) => tx.type === "expense");
  }, [monthTransactions]);

  const worthItTransactions = useMemo(() => {
    return monthExpenses.filter((tx) => tx.rating === "worth-it");
  }, [monthExpenses]);

  const regretTransactions = useMemo(() => {
    return monthExpenses.filter((tx) => tx.rating === "regret");
  }, [monthExpenses]);

  const totalWorthIt = useMemo(
    () => worthItTransactions.reduce((sum, tx) => sum + tx.amount, 0),
    [worthItTransactions]
  );

  const totalRegret = useMemo(
    () => regretTransactions.reduce((sum, tx) => sum + tx.amount, 0),
    [regretTransactions]
  );

  const totalExpenses = useMemo(
    () => monthExpenses.reduce((sum, tx) => sum + tx.amount, 0),
    [monthExpenses]
  );

  const regretPercentage =
    totalExpenses > 0 ? Math.round((totalRegret / totalExpenses) * 100) : 0;

  const mindfulScore =
    totalExpenses > 0
      ? Math.max(0, Math.min(100, Math.round(((totalExpenses - totalRegret) / totalExpenses) * 100)))
      : 100;

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
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t("insights_title")}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("insights_subtitle")}
            </p>
          </div>

          <button
            type="button"
            aria-label="Export Insights"
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Request 4: Interactive Month/Year Navigator (Can navigate to previous months) */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xs transition-colors">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Bulan sebelumnya"
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer"
            title="Lihat bulan sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">
              {monthNamesId[selectedMonth]} {selectedYear}
            </span>
            {!isCurrentMonth && (
              <button
                type="button"
                onClick={handleResetToCurrentMonth}
                className="ml-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1 cursor-pointer"
                title="Kembali ke bulan ini"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Bulan Ini</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Bulan berikutnya"
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer"
            title="Lihat bulan berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mindful Health Score Indicator */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 dark:border-emerald-800/60 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 block">
                {t("mindful_score")}
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {mindfulScore}% Keputusan Bijak
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {monthExpenses.length} Transaksi di {monthNamesId[selectedMonth]}
          </span>
        </div>
      </section>

      {/* 2. DUAL STAT METRIC HIGHLIGHTS BENTO GRID (RESET SETIAP BULAN) */}
      <section className="grid grid-cols-2 gap-3">
        {/* Regret Metric Card */}
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 flex flex-col justify-between shadow-2xs relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {t("regrets")}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-white dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold shadow-2xs border border-rose-200/60 dark:border-rose-700/60">
              {regretPercentage}% spend
            </span>
          </div>
          <div>
            <p className="text-lg font-extrabold text-rose-700 dark:text-rose-300 tracking-tight tabular-nums">
              {formatRupiah(totalRegret)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {regretTransactions.length} transaksi disesali
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-rose-200/60 dark:border-rose-800/60 flex items-center gap-1 text-rose-700 dark:text-rose-300">
            <Frown className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">❌ {t("never_again")}</span>
          </div>
        </div>

        {/* High Value / Worth It Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col justify-between shadow-2xs relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t("high_value")}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-white dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold shadow-2xs border border-emerald-200/60 dark:border-emerald-700/60">
              Top Value
            </span>
          </div>
          <div>
            <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 tracking-tight tabular-nums">
              {formatRupiah(totalWorthIt)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {worthItTransactions.length} tempat & barang
            </p>
          </div>
          <div className="mt-2.5 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
            <Flame className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">🔥 {t("again_favorite")}</span>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE FILTER SEGMENT CONTROL */}
      <section className="flex flex-col space-y-3">
        {/* Tab Controls with Pill Slider Style */}
        <div className="p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 flex items-center gap-1 transition-colors">
          <button
            type="button"
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "favorites"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>My Favorites</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
              {worthItTransactions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("blacklist")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "blacklist"
                ? "bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Blacklist</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 text-[10px] font-bold">
              {regretTransactions.length}
            </span>
          </button>
        </div>

        {/* Micro Search Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-9 px-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center gap-2 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengalaman, barang..."
              className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 4. ITEMS FEED */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {activeTab === "favorites"
              ? "Verified High-Value List"
              : "Regret History (Lessons Learned)"}
          </span>
          <span
            className={`text-xs font-extrabold tabular-nums ${
              activeTab === "favorites"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-rose-700 dark:text-rose-400"
            }`}
          >
            Total: {formatRupiah(activeTab === "favorites" ? totalWorthIt : totalRegret)}
          </span>
        </div>

        {filteredList.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 transition-colors">
            Belum ada transaksi bernilai {activeTab === "favorites" ? "'Again!'" : "'Never Again'"} pada {monthNamesId[selectedMonth]} {selectedYear}.
          </div>
        ) : (
          filteredList.map((tx) => (
            <article
              key={tx.id}
              className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs flex flex-col space-y-2.5 transition-all hover:shadow-sm ${
                activeTab === "blacklist"
                  ? "border-rose-200/70 dark:border-rose-800/60 bg-gradient-to-br from-rose-50/20 dark:from-rose-950/20 to-white dark:to-slate-900"
                  : "border-slate-200/70 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      activeTab === "favorites"
                        ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {activeTab === "favorites" ? (
                      <Flame className="w-5 h-5" />
                    ) : (
                      <AlertOctagon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {tx.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                        {tx.category}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {tx.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span
                    className={`text-xs font-extrabold tabular-nums ${
                      activeTab === "favorites"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {formatRupiah(tx.amount)}
                  </span>
                  <div
                    className={`mt-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === "favorites"
                        ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
                        : "bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60"
                    }`}
                  >
                    <span>{activeTab === "favorites" ? "🔥 Again!" : "❌ Never Again"}</span>
                  </div>
                </div>
              </div>

              {/* Reflection Quote Box */}
              {tx.reflection && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 flex flex-col space-y-1">
                  <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                    <Quote className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      User Reflection
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    &ldquo;{tx.reflection}&rdquo;
                  </p>
                </div>
              )}
            </article>
          ))
        )}
      </section>

      {/* 5. ACTIONABLE FLOW RECOMMENDATION BANNER */}
      <section className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-slate-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-900 border border-emerald-300/40 dark:border-emerald-800/50 shadow-xs flex items-start gap-3 transition-colors">
        <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 text-white shadow-sm">
          <Sparkles className="w-5 h-5 text-emerald-100" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
            Flow Recommendation ({monthNamesId[selectedMonth]})
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
            Menyaring rencana pengeluaran ke Drafts terlebih dahulu terbukti memangkas hingga 68% potensi penyesalan finansial.
          </p>
        </div>
      </section>
    </div>
  );
};
