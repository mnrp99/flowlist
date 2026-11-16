"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { formatRupiah } from "@/utils/format";
import { RupiahInput } from "@/components/ui/RupiahInput";
import {
  Eye,
  EyeOff,
  Lock,
  Info,
  AlertTriangle,
  Flame,
  Meh,
  Frown,
  Plus,
  Bookmark,
  TrendingUp,
  Sliders,
  ChevronRight,
  ArrowRight,
  X,
  Wallet,
  Coffee,
  ShoppingBag,
  Gamepad2,
  UtensilsCrossed,
  Palette,
  Glasses,
  Receipt,
  BrainCircuit,
  PlusCircle,
  ArrowDownLeft,
  Clock,
  Filter,
} from "lucide-react";

export const DashboardScreen: React.FC = () => {
  const {
    realBalance,
    lockedInDrafts,
    safeToSpend,
    drafts,
    transactions,
    isBalanceHidden,
    toggleBalanceVisibility,
    setActiveTab,
    openAddDraftModal,
    openAddIncomeModal,
    updateRealBalance,
    t,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<"all" | "expense" | "income">("all");
  // Request 3: Date filter for real-time transactions
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [isSetLimitOpen, setIsSetLimitOpen] = useState(false);
  const [customBalanceInput, setCustomBalanceInput] = useState<number>(realBalance);

  // Helper dates (ISO YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  // Calculate guarded / available percentage
  const totalTracked = Math.max(realBalance, lockedInDrafts, 1);
  const availablePercent = Math.max(0, Math.min(100, (safeToSpend / totalTracked) * 100));
  const guardedPercent = Math.max(0, Math.min(100, (lockedInDrafts / totalTracked) * 100));

  // Request 3: Filter transactions by type AND selected date, defaulting to real-time (newest first)
  const filteredTransactions = useMemo(() => {
    let result = transactions.filter((tx) => {
      if (activeFilter === "all") return true;
      return tx.type === activeFilter;
    });

    if (selectedDateFilter) {
      result = result.filter((tx) => {
        if (!tx.time) return false;
        return tx.time.includes(selectedDateFilter) || tx.time.startsWith(selectedDateFilter);
      });
    }

    // Default real-time: newest timestamp first
    result.sort((a, b) => {
      const timeA = new Date(a.time).getTime() || 0;
      const timeB = new Date(b.time).getTime() || 0;
      return timeB - timeA;
    });

    return result;
  }, [transactions, activeFilter, selectedDateFilter]);

  const getTransactionIcon = (iconType?: string) => {
    switch (iconType) {
      case "ramen":
        return <UtensilsCrossed className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "coffee":
        return <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "shopping":
        return <ShoppingBag className="w-5 h-5 text-rose-500 dark:text-rose-400" />;
      case "wallet":
        return <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case "game":
        return <Gamepad2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
      case "palette":
        return <Palette className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "glasses":
        return <Glasses className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      default:
        return <Receipt className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    }
  };

  const handleUpdateBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (customBalanceInput >= 0) {
      updateRealBalance(customBalanceInput);
      setIsSetLimitOpen(false);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-24">
      {/* 1. TOP BALANCE HERO CARD */}
      <section className="relative overflow-hidden rounded-[1.75rem] bg-[#0f172a] text-white p-5 shadow-xl shadow-slate-900/15 border border-slate-800/80 transition-all">
        {/* Subtle background ambient glowing orbs */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col">
          {/* Card Header: Title & Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-300 font-medium tracking-wide">
                {t("safe_to_spend")}
              </span>
              <button
                type="button"
                onClick={toggleBalanceVisibility}
                aria-label="Toggle balance visibility"
                className="text-slate-400 hover:text-white transition-colors p-0.5 cursor-pointer"
              >
                {isBalanceHidden ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Dynamic Status Pill */}
            {safeToSpend < 0 ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/25 border border-rose-400/40 backdrop-blur-sm shadow-sm animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span className="text-[10px] uppercase tracking-wider text-rose-300 font-extrabold">
                  DEFICIT RISK
                </span>
              </div>
            ) : safeToSpend === 0 && realBalance === 0 ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 backdrop-blur-sm shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span className="text-[10px] uppercase tracking-wider text-slate-300 font-extrabold">
                  BELUM ADA SALDO
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-extrabold">
                  AMAN DIBELANJAKAN
                </span>
              </div>
            )}
          </div>

          {/* Hero Main Amount (Safe-to-Spend) */}
          <div className="mt-3 flex items-baseline gap-1">
            <h2 className="text-3xl font-extrabold tracking-tight tabular-nums text-white">
              {isBalanceHidden ? "••••••••" : formatRupiah(safeToSpend)}
            </h2>
            {!isBalanceHidden && (
              <span className="text-xs text-slate-400 font-medium">tersisa</span>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {safeToSpend < 0
              ? "Perhatian: Alokasi draft melebihi saldo kas riil Anda!"
              : safeToSpend === 0 && realBalance === 0
              ? "Mulai dengan mencatat pemasukan atau top-up saldo kas Anda."
              : "Saldo bebas risiko setelah diamankan untuk daftar rencana draft."}
          </p>

          {/* Segmented Dual Progress Gauge Bar */}
          <div className="mt-4 pt-3.5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Bebas ({Math.round(availablePercent)}%)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Draft ({Math.round(guardedPercent)}%)
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden flex p-0.5 gap-0.5">
              <div
                style={{ width: `${availablePercent}%` }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              />
              <div
                style={{ width: `${guardedPercent}%` }}
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
              />
            </div>

            {/* Bottom 2-Column Real Stats Summary */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800/80">
              {/* Total Real Balance */}
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Wallet className="w-3.5 h-3.5 text-slate-400" />
                  {t("real_balance")}
                </span>
                <span className="text-sm font-bold text-white mt-0.5 tabular-nums">
                  {isBalanceHidden ? "••••••" : formatRupiah(realBalance)}
                </span>
              </div>

              {/* Locked in Drafts */}
              <div className="flex flex-col border-l border-slate-800/80 pl-3">
                <span className="text-[11px] text-amber-400/90 flex items-center gap-1 font-medium">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  {t("locked_in_drafts")}
                </span>
                <span className="text-sm font-bold text-amber-400 mt-0.5 tabular-nums">
                  {isBalanceHidden ? "••••••" : formatRupiah(lockedInDrafts)}
                </span>
              </div>
            </div>

            {/* Tombol Input Pemasukan / Top-up Saldo */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center gap-2">
              <button
                type="button"
                onClick={openAddIncomeModal}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-[0.98] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-100" />
                <span>{t("add_income")}</span>
              </button>

              <button
                type="button"
                onClick={openAddDraftModal}
                className="py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 active:scale-[0.98] text-slate-200 text-xs font-bold flex items-center justify-center gap-1 transition-all border border-slate-700/80 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Draft</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTEXTUAL WARNING BANNER */}
      {safeToSpend < 0 && !isBannerDismissed && (
        <section className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <strong className="font-extrabold block text-rose-800 dark:text-rose-300 mb-0.5">
              Peringatan Defisit: Alokasi Draft Melebihi Saldo!
            </strong>
            <p className="text-rose-700 dark:text-rose-300 leading-relaxed">
              Anda memiliki alokasi draft sebesar {formatRupiah(lockedInDrafts)}, melebihi saldo kas riil sebesar {formatRupiah(realBalance)}. Hapus draft atau tambahkan pemasukan!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsBannerDismissed(true)}
            aria-label="Dismiss warning banner"
            className="text-rose-400 hover:text-rose-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* 3. QUICK ACTION BENTO GRID */}
      <section className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={openAddIncomeModal}
          className="group flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-md active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate w-full">
            + Income
          </span>
        </button>

        <button
          type="button"
          onClick={openAddDraftModal}
          className="group flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-md active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Bookmark className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate w-full">
            + Draft
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("insights")}
          className="group flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-md active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-400 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate w-full">
            Analytics
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCustomBalanceInput(realBalance);
            setIsSetLimitOpen(true);
          }}
          className="group flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-md active:scale-95 transition-all text-center cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Sliders className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate w-full">
            Set Saldo
          </span>
        </button>
      </section>

      {/* Quick Balance Adjustment Simulator Modal dengan RupiahInput */}
      {isSetLimitOpen && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Ubah Real Balance (Simulator)
            </h4>
            <button
              type="button"
              onClick={() => setIsSetLimitOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleUpdateBalance} className="space-y-2">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <RupiahInput
                value={customBalanceInput}
                onChange={setCustomBalanceInput}
                size="md"
                placeholder="0"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Atur nominal saldo untuk menguji dinamika Safe-to-Spend.
              </p>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 active:scale-95 cursor-pointer"
              >
                Terapkan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. RECENT CASHFLOW & TRANSACTIONS SECTION */}
      <section className="flex flex-col space-y-3">
        {/* Header & Filter Bar */}
        <div className="flex flex-col space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t("recent_activity")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Catatan pengeluaran & pemasukan sadar
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("insights")}
              className="text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{t("view_all")}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                activeFilter === "all"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800"
              }`}
            >
              {t("filter_all")}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("expense")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                activeFilter === "expense"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800"
              }`}
            >
              {t("filter_expenses")}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("income")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                activeFilter === "income"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800"
              }`}
            >
              {t("filter_incomes")}
            </button>
          </div>

          {/* Request 3: Date Filter & Real-Time Bar for Transactions */}
          <div className="flex items-center justify-between gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Tanggal:</span>
              <button
                type="button"
                onClick={() => setSelectedDateFilter("")}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                  selectedDateFilter === ""
                    ? "bg-emerald-600 text-white"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Real-Time
              </button>
              <button
                type="button"
                onClick={() => setSelectedDateFilter(todayStr)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                  selectedDateFilter === todayStr
                    ? "bg-emerald-600 text-white"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Hari Ini
              </button>
            </div>

            <div className="relative inline-flex items-center">
              <input
                type="date"
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="text-[11px] font-semibold py-0.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none"
                title="Pilih tanggal transaksi"
              />
              {selectedDateFilter && (
                <button
                  type="button"
                  onClick={() => setSelectedDateFilter("")}
                  className="ml-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                  title="Hapus filter tanggal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Transaction List Stack */}
        <div className="space-y-2.5">
          {filteredTransactions.length === 0 ? (
            <div className="p-6 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 text-xs">
              {selectedDateFilter
                ? `Tidak ada transaksi tercatat pada tanggal ${selectedDateFilter}.`
                : "Belum ada transaksi di kategori ini."}
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <article
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xs hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      tx.type === "income"
                        ? "bg-emerald-50 dark:bg-emerald-950/70"
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    {getTransactionIcon(tx.iconType)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tx.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {tx.category} • {tx.time}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span
                    className={`text-xs font-extrabold tabular-nums ${
                      tx.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                        : "text-rose-600 dark:text-rose-400 font-extrabold"
                    }`}
                  >
                    {tx.type === "income"
                      ? `+${formatRupiah(tx.amount)}`
                      : `-${formatRupiah(tx.amount)}`}
                  </span>

                  {/* Rating / Income Badge */}
                  {tx.type === "income" ? (
                    <div className="mt-1 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300/60 dark:border-emerald-800/60">
                      <ArrowDownLeft className="w-3 h-3 text-emerald-700 dark:text-emerald-300" />
                      <span>INCOME</span>
                    </div>
                  ) : tx.rating === "worth-it" ? (
                    <div className="mt-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/60 dark:border-emerald-800/60">
                      <Flame className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Worth It</span>
                    </div>
                  ) : tx.rating === "so-so" ? (
                    <div className="mt-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200/60 dark:border-amber-800/60">
                      <Meh className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>So-So</span>
                    </div>
                  ) : tx.rating === "regret" ? (
                    <div className="mt-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-[10px] font-bold border border-rose-200/60 dark:border-rose-800/60">
                      <Frown className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                      <span>Regret</span>
                    </div>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* 5. MINDFUL REFLECTION NUDGE CARD */}
      <section className="relative p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xs overflow-hidden flex items-center gap-3.5 transition-colors">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
            Mindful Flow Score
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
            82% Worth-It Rate
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Keputusan belanja Anda lebih terencana dibanding pengeluaran impulsif!
          </p>
        </div>
      </section>
    </div>
  );
};
