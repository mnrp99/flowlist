"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { WorthItRating } from "@/types";
import { formatRupiah } from "@/utils/format";
import { RupiahInput } from "@/components/ui/RupiahInput";
import {
  X,
  Sparkles,
  CheckCircle2,
  ScanLine,
  Check,
  Receipt,
  RotateCcw,
} from "lucide-react";

export const CompletePlanBottomSheet: React.FC = () => {
  const {
    isScanModalOpen,
    closeScanModal,
    selectedDraftForDone,
    completeDraft,
    realBalance,
    lockedInDrafts,
  } = useApp();

  const [actualAmount, setActualAmount] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<WorthItRating>("worth-it");
  const [reflection, setReflection] = useState<string>("");
  const [customTitle, setCustomTitle] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [scanConfidence, setScanConfidence] = useState<number>(99.4);

  // Sync state when modal opens
  useEffect(() => {
    if (isScanModalOpen) {
      if (selectedDraftForDone) {
        setActualAmount(selectedDraftForDone.estimatedCost || 325000);
        setCustomTitle(selectedDraftForDone.title);
      } else {
        setActualAmount(150000);
        setCustomTitle("Nota Pembayaran");
      }
      setSelectedRating("worth-it");
      setReflection("");
      setHasScanned(false);
      setIsScanning(false);
    }
  }, [isScanModalOpen, selectedDraftForDone]);

  if (!isScanModalOpen) return null;

  const draftEst = selectedDraftForDone ? selectedDraftForDone.estimatedCost : 0;
  const adjustedSafeToSpend =
    realBalance - actualAmount - (lockedInDrafts - draftEst);

  // Simulate AI OCR scan
  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      if (selectedDraftForDone) {
        const simulatedBill = selectedDraftForDone.estimatedCost + 25000;
        setActualAmount(simulatedBill);
      } else {
        setActualAmount(325000);
        setCustomTitle("Izakaya Ramen Blok M - Bill #8492");
      }
      setScanConfidence(99.4);
    }, 1200);
  };

  const handleSave = () => {
    if (actualAmount <= 0) return;
    completeDraft(
      selectedDraftForDone ? selectedDraftForDone.id : null,
      actualAmount,
      selectedRating,
      reflection,
      customTitle,
      selectedDraftForDone?.subtag || "Dining & Hangout"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Dimmed Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeScanModal}
      />

      {/* BOTTOM SHEET CONTAINER (Max 430px) */}
      <div className="relative z-10 w-full max-w-[430px] mx-auto bg-white dark:bg-slate-900 rounded-t-[32px] shadow-[0_-12px_40px_rgba(15,23,42,0.25)] border-t border-slate-100 dark:border-slate-800 max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-8 duration-300">
        {/* Top Handle Bar */}
        <div className="pt-3 pb-1 flex justify-center items-center cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1 border border-emerald-200/50 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Resolution Mode
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {selectedDraftForDone
                ? `Complete Plan: ${selectedDraftForDone.title}`
                : "Scan & Log Transaksi Baru"}
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              {selectedDraftForDone ? (
                <>
                  <span>
                    Estimasi awal:{" "}
                    <strong className="text-slate-800 dark:text-white font-bold tabular-nums">
                      {formatRupiah(selectedDraftForDone.estimatedCost)}
                    </strong>
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.2 rounded">
                    Draft locked
                  </span>
                </>
              ) : (
                <span>Scan struk pembayaran untuk langsung memotong saldo kas</span>
              )}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={closeScanModal}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Sheet Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-4">
          {/* 1. SIMULATE AI RECEIPT SCANNER BOX */}
          <div className="relative bg-gradient-to-b from-emerald-50/70 dark:from-emerald-950/30 to-slate-50/50 dark:to-slate-900/50 rounded-2xl border-2 border-dashed border-emerald-300/80 dark:border-emerald-800/80 p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                {hasScanned ? "✨ AI Terbaca dari Struk" : "Smart Receipt OCR"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                {hasScanned ? `${scanConfidence}% confidence` : "Simulasi scan 1-klik"}
              </span>
            </div>

            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-5 gap-2">
                <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 animate-pulse">
                  Menganalisis foto struk dengan AI OCR...
                </span>
              </div>
            ) : hasScanned ? (
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                <div className="w-12 h-14 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex flex-col items-center justify-center shrink-0">
                  <Receipt className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">Scanned</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {customTitle || "Struk Pembayaran Merchant"}
                    </h4>
                    <button
                      type="button"
                      onClick={handleSimulateScan}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Retake
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Item terdeteksi • Pajak & Layanan Otomatis
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Nominal terisi otomatis ({formatRupiah(actualAmount)})
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSimulateScan}
                className="w-full py-3.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all shadow-xs group cursor-pointer"
              >
                <ScanLine className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Simulasi 1-Klik Scan Nota (Otomatis Isi Harga)</span>
              </button>
            )}
          </div>

          {/* 2. ACTUAL AMOUNT INPUT DENGAN FORMAT TITIK OTOMATIS */}
          <div className="bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl p-3.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Nominal Asli Pengeluaran (Struk)
              </label>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                Format Otomatis (50.000)
              </span>
            </div>

            <RupiahInput
              value={actualAmount}
              onChange={setActualAmount}
              size="hero"
              placeholder="0"
              required
            />

            {/* Deduction impact preview */}
            <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Dampak pemotongan saldo:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Safe-to-Spend akan menjadi{" "}
                <span
                  className={
                    adjustedSafeToSpend < 0 ? "text-rose-600 dark:text-rose-400 font-extrabold" : "text-emerald-600 dark:text-emerald-400 font-extrabold"
                  }
                >
                  {formatRupiah(adjustedSafeToSpend)}
                </span>
              </span>
            </div>
          </div>

          {/* 3. MANDATORY WORTH-IT RATING SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Apakah sebanding dengan uang Anda?</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Wajib Dinilai
              </span>
            </div>

            {/* 3 Pilihan Kartu Rating */}
            <div className="grid grid-cols-3 gap-2">
              {/* Option 1: Again! */}
              <button
                type="button"
                onClick={() => setSelectedRating("worth-it")}
                className={`relative flex flex-col items-center text-center p-3 rounded-2xl transition-all cursor-pointer ${
                  selectedRating === "worth-it"
                    ? "bg-emerald-50/80 dark:bg-emerald-950/70 border-2 border-emerald-500 shadow-sm scale-[1.02]"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                }`}
              >
                {selectedRating === "worth-it" && (
                  <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-xl mb-1 shadow-2xs">
                  🔥
                </div>
                <div className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200 tracking-tight leading-tight">
                  Again!
                </div>
                <div className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 mt-1 leading-tight">
                  Puas banget / Pasti balik lagi
                </div>
              </button>

              {/* Option 2: Sometimes */}
              <button
                type="button"
                onClick={() => setSelectedRating("so-so")}
                className={`relative flex flex-col items-center text-center p-3 rounded-2xl transition-all cursor-pointer ${
                  selectedRating === "so-so"
                    ? "bg-amber-50/80 dark:bg-amber-950/70 border-2 border-amber-500 shadow-sm scale-[1.02]"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-300"
                }`}
              >
                {selectedRating === "so-so" && (
                  <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center text-xl mb-1 shadow-2xs">
                  🤔
                </div>
                <div className="font-extrabold text-xs text-amber-900 dark:text-amber-200 tracking-tight leading-tight">
                  Sometimes
                </div>
                <div className="text-[10px] font-medium text-amber-700 dark:text-amber-400 mt-1 leading-tight">
                  Lumayan, sesekali aja
                </div>
              </button>

              {/* Option 3: Never Again */}
              <button
                type="button"
                onClick={() => setSelectedRating("regret")}
                className={`relative flex flex-col items-center text-center p-3 rounded-2xl transition-all cursor-pointer ${
                  selectedRating === "regret"
                    ? "bg-rose-50/80 dark:bg-rose-950/70 border-2 border-rose-500 shadow-sm scale-[1.02]"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-300"
                }`}
              >
                {selectedRating === "regret" && (
                  <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 flex items-center justify-center text-xl mb-1 shadow-2xs">
                  ❌
                </div>
                <div className="font-extrabold text-xs text-rose-900 dark:text-rose-200 tracking-tight leading-tight">
                  Never Again
                </div>
                <div className="text-[10px] font-medium text-rose-700 dark:text-rose-400 mt-1 leading-tight">
                  Buang uang / Menyesal
                </div>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium text-center mt-2">
              Penilaian ini melatih{" "}
              <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                Mindful Flow Score
              </strong>{" "}
              dan tab Insights favorit vs blacklist Anda.
            </p>
          </div>

          {/* 4. OPTIONAL REFLECTION NOTE */}
          <div className="bg-slate-50 dark:bg-slate-800/90 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Catatan Refleksi Pengeluaran (Opsional)
            </label>
            <input
              type="text"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Contoh: Kuah tonkotsu mantap, worth it bawa teman!"
              className="w-full text-xs p-2.5 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* BOTTOM ACTION AREA & PRIMARY BUTTON */}
        <div className="px-5 pt-3 pb-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={actualAmount <= 0}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 active:scale-[0.99] text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-100" />
            <span>Save Expense & Deduct Balance</span>
          </button>

          <button
            type="button"
            onClick={closeScanModal}
            className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Simpan di Drafts Dulu (Nanti Saja)
          </button>
        </div>
      </div>
    </div>
  );
};
