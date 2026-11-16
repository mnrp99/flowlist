"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { RupiahInput } from "@/components/ui/RupiahInput";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import {
  X,
  PlusCircle,
  ArrowDownLeft,
  Building,
  ArrowRightLeft,
  Gift,
  Coins,
} from "lucide-react";

const INCOME_SOURCES = [
  { label: "Gaji Bulanan", icon: Building },
  { label: "Transfer Masuk", icon: ArrowRightLeft },
  { label: "Freelance", icon: Coins },
  { label: "Bonus / THR", icon: Gift },
];

export const AddIncomeBottomSheet: React.FC = () => {
  const { isAddIncomeModalOpen, closeAddIncomeModal, addIncome } = useApp();

  const [amount, setAmount] = useState<number>(0);
  const [source, setSource] = useState<string>("Gaji Bulanan");
  const [customTitle, setCustomTitle] = useState<string>("");
  const [dateTime, setDateTime] = useState<string>("Hari ini • Baru saja");

  if (!isAddIncomeModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    const title = customTitle.trim() || source;
    addIncome(amount, source, title, dateTime);

    // Reset
    setAmount(0);
    setCustomTitle("");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Dimmed Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={closeAddIncomeModal}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-[430px] mx-auto bg-white dark:bg-slate-900 rounded-t-[32px] shadow-[0_-12px_40px_rgba(15,23,42,0.25)] border-t border-slate-100 dark:border-slate-800 max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-8 duration-300">
        {/* Handle Bar */}
        <div className="pt-3 pb-1 flex justify-center items-center cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Tambah Pemasukan (Income)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Top-up dana ke Real Balance & Safe-to-Spend
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={closeAddIncomeModal}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto no-scrollbar">
          {/* 1. Nominal Input dengan Thousand Separator Otomatis */}
          <div className="bg-slate-50 dark:bg-slate-800/90 border-2 border-emerald-500/40 rounded-2xl p-4 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition-all shadow-xs">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Nominal Pemasukan
              </label>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                Format Otomatis (id-ID)
              </span>
            </div>

            <RupiahInput
              value={amount}
              onChange={setAmount}
              size="hero"
              placeholder="0"
              autoFocus
              required
            />

            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Ketik angka murni (contoh: ketik 1500000 langsung menjadi 1.500.000).
            </p>
          </div>

          {/* 2. Sumber Pemasukan Chips */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 block">
              Sumber Dana / Kategori
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INCOME_SOURCES.map((item) => {
                const Icon = item.icon;
                const isSelected = source === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSource(item.label);
                      if (!customTitle) setCustomTitle(item.label);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm scale-[1.01]"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Deskripsi / Judul Transaksi */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 block">
              Keterangan / Catatan Transaksi
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Contoh: Gaji Pokok Nov, Transfer dari Budi, dll"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* 4. Pemilih Tanggal & Waktu (Interactive DateTimePicker) */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 block">
              Tanggal Penerimaan
            </label>
            <DateTimePicker
              value={dateTime}
              onChange={setDateTime}
              label="Waktu Pemasukan Diterima"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={amount <= 0}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 active:scale-[0.99] text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-emerald-100" />
              <span>Simpan Pemasukan & Tambah Saldo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
