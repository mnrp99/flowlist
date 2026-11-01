"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatRupiah } from "@/utils/format";
import {
  User,
  Shield,
  RotateCcw,
  Smartphone,
  Wallet,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export const ProfileScreen: React.FC = () => {
  const { realBalance, updateRealBalance, resetData, drafts, transactions } = useApp();
  const [balanceInput, setBalanceInput] = useState(String(realBalance));
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(balanceInput.replace(/[^0-9]/g, ""));
    if (!isNaN(val) && val >= 0) {
      updateRealBalance(val);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2000);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all dummy data back to default values?")) {
      resetData();
      setBalanceInput("2000000");
      alert("Data has been reset to defaults!");
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* 1. Profile Header Card */}
      <section className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative">
          <img
            alt="Profile Avatar"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-md"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
          />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
            ✓
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-base font-extrabold text-slate-900 leading-tight">
            Rian Adiputra
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Mindful Spender & Saver</p>
          <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>WorthIt Flow Pro Member</span>
          </div>
        </div>
      </section>

      {/* 2. Simulation & Balance Controls */}
      <section className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Simulate Real Balance
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Update your active cash in bank to test how Safe-to-Spend behaves when higher or lower than locked drafts.
        </p>

        <form onSubmit={handleUpdate} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                Rp
              </span>
              <input
                type="text"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                placeholder="2000000"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Update
            </button>
          </div>
          {isSavedNotice && (
            <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Balance updated successfully!
            </p>
          )}
        </form>
      </section>

      {/* 3. Stage 1 App Stats Summary */}
      <section className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Tahap 1 Prototype Status
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Active Drafts
            </span>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">
              {drafts.length} Items
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Transactions
            </span>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">
              {transactions.length} Records
            </p>
          </div>
        </div>
      </section>

      {/* 4. Reset Data Button */}
      <section className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Reset Local Dummy Data</h4>
            <p className="text-[11px] text-slate-500">Restore default demo dataset</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
        >
          Reset
        </button>
      </section>

      {/* 5. PWA Info Box */}
      <section className="p-4 rounded-3xl bg-slate-100 border border-slate-200/60 flex items-start gap-3">
        <Smartphone className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900 font-bold block mb-0.5">
            Progressive Web App (PWA) Ready
          </strong>
          You can add WorthIt Flow to your home screen on iOS / Android via &quot;Add to Home Screen&quot; for a full native app experience.
        </div>
      </section>
    </div>
  );
};
