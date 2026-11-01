"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatRupiah } from "@/utils/format";
import { RupiahInput } from "@/components/ui/RupiahInput";
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
  const [balanceInput, setBalanceInput] = useState<number>(realBalance);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (balanceInput >= 0) {
      updateRealBalance(balanceInput);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2000);
    }
  };

  const handleReset = () => {
    if (confirm("Reset seluruh data lokal ke nilai awal default?")) {
      resetData();
      setBalanceInput(2000000);
      alert("Data berhasil direset ke kondisi awal!");
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

      {/* 2. Simulation & Balance Controls dengan RupiahInput */}
      <section className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Simulasi Saldo Kas (Real Balance)
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Ubah saldo kas aktif untuk menguji dinamika Safe-to-Spend (saldo aman setelah dikurangi alokasi draft).
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Update
            </button>
          </div>
          {isSavedNotice && (
            <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Saldo berhasil diperbarui!
            </p>
          )}
        </form>
      </section>

      {/* 3. Stage 1 App Stats Summary */}
      <section className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Status Prototipe Tahap 1
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Drafts Aktif
            </span>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">
              {drafts.length} Item
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Riwayat Transaksi
            </span>
            <p className="text-base font-extrabold text-slate-800 mt-0.5">
              {transactions.length} Data
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
            <h4 className="text-xs font-bold text-slate-900">Reset Data Dummy Lokal</h4>
            <p className="text-[11px] text-slate-500">Kembalikan ke data awal demo</p>
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
          Anda dapat menambahkan WorthIt Flow ke layar utama smartphone (Add to Home Screen) di iOS / Android.
        </div>
      </section>
    </div>
  );
};
