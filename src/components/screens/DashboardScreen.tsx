"use client";

import React, { useState } from "react";
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
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<"all" | "expense" | "income">("all");
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [isSetLimitOpen, setIsSetLimitOpen] = useState(false);
  const [customBalanceInput, setCustomBalanceInput] = useState<number>(realBalance);

  // Calculate guarded / available percentage
  const totalTracked = Math.max(realBalance, lockedInDrafts, 1);
  const availablePercent = Math.max(0, Math.min(100, (safeToSpend / totalTracked) * 100));
  const guardedPercent = Math.max(0, Math.min(100, (lockedInDrafts / totalTracked) * 100));

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === "all") return true;
    return tx.type === activeFilter;
  });

  const getTransactionIcon = (iconType?: string) => {
    switch (iconType) {
      case "ramen":
        return <UtensilsCrossed className="w-5 h-5 text-amber-700" />;
      case "coffee":
        return <Coffee className="w-5 h-5 text-amber-600" />;
      case "shopping":
        return <ShoppingBag className="w-5 h-5 text-rose-500" />;
      case "wallet":
        return <Wallet className="w-5 h-5 text-emerald-600" />;
      case "game":
        return <Gamepad2 className="w-5 h-5 text-indigo-500" />;
      case "palette":
        return <Palette className="w-5 h-5 text-amber-600" />;
      case "glasses":
        return <Glasses className="w-5 h-5 text-teal-600" />;
      default:
        return <Receipt className="w-5 h-5 text-slate-500" />;
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
      <section className="relative overflow-hidden rounded-[1.75rem] bg-[#0f172a] text-white p-5 shadow-xl shadow-slate-900/15 transition-all">
        {/* Subtle background ambient glowing orbs */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col">
          {/* Card Header: Title & Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-300 font-medium tracking-wide">
                Safe-to-Spend
              </span>
              <button
                type="button"
                onClick={toggleBalanceVisibility}
                aria-label="Toggle balance visibility"
                className="text-slate-400 hover:text-white transition-colors p-0.5"
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
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-extrabold">
                  SAFE ZONE
                </span>
              </div>
            )}
          </div>

          {/* Main Balance Display */}
          <div className="mt-2.5">
            <h2 className="text-3xl font-extrabold tracking-tight text-white tabular-nums">
              {isBalanceHidden ? "Rp ••••••••" : formatRupiah(safeToSpend)}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {safeToSpend < 0
                ? "Peringatan: Alokasi draft melebihi saldo kas riil!"
                : "Alokasi aman setelah dikurangi dana proteksi draft"}
            </p>
          </div>

          {/* Surface Divider */}
          <div className="w-full h-px bg-white/10 my-4" />

          {/* Two-Column Breakdown */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Real Balance */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                <span>Real Balance</span>
                <Info className="w-3 h-3 opacity-70" />
              </div>
              <span className="text-sm font-bold text-white mt-0.5 tabular-nums">
                {isBalanceHidden ? "Rp ••••••••" : formatRupiah(realBalance)}
              </span>
            </div>

            {/* Locked in Drafts */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
                <Lock className="w-3 h-3" />
                <span>Locked in Drafts</span>
              </div>
              <span className="text-sm font-bold text-emerald-300 mt-0.5 tabular-nums">
                {isBalanceHidden ? "Rp ••••••••" : formatRupiah(lockedInDrafts)}
              </span>
            </div>
          </div>

          {/* Ratio Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                safeToSpend < 0 ? "bg-rose-500" : "bg-emerald-500"
              }`}
              style={{ width: `${availablePercent}%` }}
            />
            <div
              className="bg-amber-400/80 h-full transition-all duration-500"
              style={{ width: `${guardedPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 px-0.5">
            <span>
              {safeToSpend < 0 ? "0% Available" : `${availablePercent.toFixed(1)}% Available`}
            </span>
            <span>
              {guardedPercent.toFixed(1)}% Guarded (
              {drafts.filter((d) => d.category !== "to-do").length} Rencana Terkunci)
            </span>
          </div>

          {/* REVISI 4: TOMBOL "+ TAMBAH PEMASUKAN (INCOME)" DI HERO CARD */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={openAddIncomeModal}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:scale-[0.98] text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>+ Tambah Pemasukan (Income)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. CONTEXTUAL STATUS & WARNING BANNERS */}
      {/* 2A. Fresh User / Empty Wallet Tip */}
      {realBalance === 0 && lockedInDrafts === 0 && !isBannerDismissed && (
        <aside className="relative flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/90 border border-indigo-200/80 text-indigo-950 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <PlusCircle className="w-4 h-4" />
            </div>
            <p className="text-xs text-indigo-900 font-medium">
              Mulai catat keuanganmu dengan menambah pemasukan pertama.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddIncomeModal}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shrink-0 cursor-pointer"
          >
            + Top Up
          </button>
        </aside>
      )}

      {/* 2B. AUTOMATIC RED WARNING BANNER (When Safe-to-Spend < 0) */}
      {safeToSpend < 0 && (
        <aside className="relative flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 shadow-md shadow-rose-500/10 animate-bounce duration-1000">
          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <h4 className="text-xs font-bold text-rose-900 leading-tight">
              ⚠️ Peringatan Kritis! Saldo Minus (Defisit)
            </h4>
            <p className="text-xs text-rose-800 leading-snug mt-0.5">
              Nilai Safe-to-Spend Anda bernilai minus (
              <strong className="font-extrabold">{formatRupiah(safeToSpend)}</strong>
              ). Rencana pengeluaran di draft melebihi saldo kas nyata sebesar{" "}
              {formatRupiah(Math.abs(safeToSpend))}!
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setActiveTab("drafts")}
                className="inline-flex items-center gap-1 text-xs text-rose-700 font-extrabold hover:underline"
              >
                <span>Tinjau Drafts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={openAddIncomeModal}
                className="inline-flex items-center gap-1 text-xs text-emerald-800 font-extrabold bg-emerald-100/80 px-2 py-0.5 rounded-lg hover:bg-emerald-200"
              >
                <span>+ Top Up Pemasukan</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2C. Regular Caution Banner (HANYA muncul jika alokasi draft > 80% dari saldo kas riil) */}
      {safeToSpend >= 0 &&
        !isBannerDismissed &&
        realBalance > 0 &&
        lockedInDrafts > 0 &&
        safeToSpend <= realBalance * 0.2 && (
          <aside className="relative flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 shadow-sm transition-all hover:bg-amber-50">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs text-amber-900 leading-snug">
                Perhatian: Alokasi draft rencana telah mengunci lebih dari 80% saldo kas Anda ({formatRupiah(lockedInDrafts)} dari {formatRupiah(realBalance)}).
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("drafts")}
                className="inline-flex items-center gap-1 text-xs text-amber-800 font-bold mt-1 hover:underline"
              >
                <span>Tinjau Drafts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              aria-label="Dismiss banner"
              onClick={() => setIsBannerDismissed(true)}
              className="text-amber-600 hover:text-amber-800 p-1 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </aside>
        )}

      {/* 3. QUICK ACTION SHORTCUT TILES */}
      <section aria-label="Quick Actions" className="grid grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={openAddDraftModal}
          className="group flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md active:scale-95 transition-all text-center"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 truncate w-full">
            Quick Add
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("drafts")}
          className="group flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md active:scale-95 transition-all text-center"
        >
          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center relative group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <Bookmark className="w-5 h-5" />
            {drafts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                {drafts.length}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold text-slate-800 truncate w-full">
            Wishlist
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("insights")}
          className="group flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md active:scale-95 transition-all text-center"
        >
          <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition-colors">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 truncate w-full">
            Analytics
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCustomBalanceInput(realBalance);
            setIsSetLimitOpen(true);
          }}
          className="group flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md active:scale-95 transition-all text-center"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Sliders className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 truncate w-full">
            Set Saldo
          </span>
        </button>
      </section>

      {/* Quick Balance Adjustment Simulator Modal dengan RupiahInput */}
      {isSetLimitOpen && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-slate-900">
              Ubah Real Balance (Simulator)
            </h4>
            <button
              type="button"
              onClick={() => setIsSetLimitOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleUpdateBalance} className="space-y-2">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <RupiahInput
                value={customBalanceInput}
                onChange={setCustomBalanceInput}
                size="md"
                placeholder="0"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-500">
                Atur nominal lebih kecil dari {formatRupiah(lockedInDrafts)} untuk menguji banner merah.
              </p>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 active:scale-95"
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
              <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
              <p className="text-xs text-slate-500">Catatan pengeluaran & pemasukan sadar</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("insights")}
              className="text-emerald-700 text-xs font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("expense")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeFilter === "expense"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              Expenses
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("income")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeFilter === "income"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Transaction List Stack */}
        <div className="space-y-2.5">
          {filteredTransactions.length === 0 ? (
            <div className="p-6 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 text-xs">
              Belum ada transaksi di kategori ini.
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <article
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      tx.type === "income" ? "bg-emerald-50" : "bg-slate-100"
                    }`}
                  >
                    {getTransactionIcon(tx.iconType)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {tx.title}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">
                      {tx.category} • {tx.time}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span
                    className={`text-xs font-extrabold tabular-nums ${
                      tx.type === "income" ? "text-emerald-600 font-extrabold" : "text-rose-600"
                    }`}
                  >
                    {tx.type === "income"
                      ? `+${formatRupiah(tx.amount)}`
                      : `-${formatRupiah(tx.amount)}`}
                  </span>

                  {/* Rating / Income Badge */}
                  {tx.type === "income" ? (
                    <div className="mt-1 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[10px] font-extrabold border border-emerald-300/60">
                      <ArrowDownLeft className="w-3 h-3 text-emerald-700" />
                      <span>INCOME</span>
                    </div>
                  ) : tx.rating === "worth-it" ? (
                    <div className="mt-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                      <Flame className="w-3 h-3 text-emerald-600" />
                      <span>Worth It</span>
                    </div>
                  ) : tx.rating === "so-so" ? (
                    <div className="mt-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200/60">
                      <Meh className="w-3 h-3 text-amber-600" />
                      <span>So-So</span>
                    </div>
                  ) : tx.rating === "regret" ? (
                    <div className="mt-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200/60">
                      <Frown className="w-3 h-3 text-rose-600" />
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
      <section className="relative p-4 rounded-3xl bg-white border border-slate-100 shadow-xs overflow-hidden flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">
            Mindful Flow Score
          </span>
          <h4 className="text-sm font-bold text-slate-900 leading-tight mt-0.5">
            82% Worth-It Rate
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Keputusan belanja Anda 14% lebih terencana dibanding bulan lalu!
          </p>
        </div>
      </section>
    </div>
  );
};
