"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { RupiahInput } from "@/components/ui/RupiahInput";
import {
  Shield,
  RotateCcw,
  Smartphone,
  Wallet,
  Sparkles,
  CheckCircle,
  LogOut,
  Mail,
  Database,
  RefreshCw,
  Loader2,
} from "lucide-react";

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    realBalance,
    updateRealBalance,
    refreshData,
    drafts,
    transactions,
    logout,
    isSyncing,
  } = useApp();

  const [balanceInput, setBalanceInput] = useState<number>(realBalance);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Sync balanceInput with realBalance
  useEffect(() => {
    setBalanceInput(realBalance);
  }, [realBalance]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (balanceInput >= 0) {
      await updateRealBalance(balanceInput);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2000);
    }
  };

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun?")) {
      setIsLoggingOut(true);
      await logout();
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4 animate-in fade-in duration-200">
      {/* 1. Profile Header Card */}
      <section className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
            {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
            ✓
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-base font-extrabold text-slate-900 leading-tight truncate">
            {currentUser?.email?.split("@")[0] || "Akun Saya"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 truncate">
            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{currentUser?.email || "Tidak ada email"}</span>
          </p>
          <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200/60">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>Supabase Auth Verified</span>
          </div>
        </div>
      </section>

      {/* 2. Simulation & Balance Controls dengan RupiahInput */}
      <section className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Simulasi Saldo Kas (Real Balance)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => refreshData()}
            disabled={isSyncing}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Ubah saldo kas aktif untuk menguji dinamika Safe-to-Spend (saldo aman setelah dikurangi alokasi draft rencana).
        </p>

        <form onSubmit={handleUpdate} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <RupiahInput
                value={balanceInput}
                onChange={setBalanceInput}
                size="md"
                placeholder="0"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSyncing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-60 cursor-pointer"
            >
              Update
            </button>
          </div>
          {isSavedNotice && (
            <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Saldo di database Supabase berhasil diperbarui!
            </p>
          )}
        </form>
      </section>

      {/* 3. Database & App Stats Summary */}
      <section className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Database Prisma v6
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Draft Plans di DB
            </span>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">
              {drafts.length} Item
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Transaksi di DB
            </span>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">
              {transactions.length} Data
            </p>
          </div>
        </div>
      </section>

      {/* 4. Logout Section */}
      <section className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Keluar dari Akun</h4>
            <p className="text-[11px] text-slate-500">Akhiri sesi Supabase Auth</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {isLoggingOut ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LogOut className="w-3.5 h-3.5" />
          )}
          <span>Keluar</span>
        </button>
      </section>

      {/* 5. PWA Info Box */}
      <section className="p-4 rounded-3xl bg-slate-100 border border-slate-200/60 flex items-start gap-3">
        <Smartphone className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900 font-bold block mb-0.5">
            Progressive Web App (PWA) Ready
          </strong>
          Anda dapat menambahkan WorthIt Flow ke layar utama smartphone (Add to Home Screen) di iOS / Android.
        </div>
      </section>
    </div>
  );
};
