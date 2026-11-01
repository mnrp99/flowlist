"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { WorthItRating } from "@/types";
import { formatRupiah } from "@/utils/format";
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

  const [actualAmount, setActualAmount] = useState<string>("");
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
        setActualAmount(String(selectedDraftForDone.estimatedCost || 325000));
        setCustomTitle(selectedDraftForDone.title);
      } else {
        setActualAmount("150000");
        setCustomTitle("Receipt Expense");
      }
      setSelectedRating("worth-it");
      setReflection("");
      setHasScanned(false);
      setIsScanning(false);
    }
  }, [isScanModalOpen, selectedDraftForDone]);

  if (!isScanModalOpen) return null;

  const numericAmount = Number(actualAmount.replace(/[^0-9]/g, "")) || 0;
  const draftEst = selectedDraftForDone ? selectedDraftForDone.estimatedCost : 0;
  const adjustedSafeToSpend =
    realBalance - numericAmount - (lockedInDrafts - draftEst);

  // Simulate AI OCR scan
  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      if (selectedDraftForDone) {
        const simulatedBill = selectedDraftForDone.estimatedCost + 25000;
        setActualAmount(String(simulatedBill));
      } else {
        setActualAmount("325000");
        setCustomTitle("Izakaya Ramen Blok M - Bill #8492");
      }
      setScanConfidence(99.4);
    }, 1200);
  };

  const handleSave = () => {
    if (numericAmount <= 0) return;
    completeDraft(
      selectedDraftForDone ? selectedDraftForDone.id : null,
      numericAmount,
      selectedRating,
      reflection,
      customTitle,
      selectedDraftForDone?.subtag || "Dining & Hangout"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Dimmed & Blurred Background Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeScanModal}
      />

      {/* BOTTOM SHEET CONTAINER (Max 430px) */}
      <div className="relative z-10 w-full max-w-[430px] mx-auto bg-white rounded-t-[32px] shadow-[0_-12px_40px_rgba(15,23,42,0.25)] border-t border-slate-100 max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-8 duration-300">
        {/* Top Handle Bar */}
        <div className="pt-3 pb-1 flex justify-center items-center cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-3 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1 border border-emerald-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Resolution Mode
            </div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
              {selectedDraftForDone
                ? `Complete Plan: ${selectedDraftForDone.title}`
                : "Scan & Log New Expense"}
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
              {selectedDraftForDone ? (
                <>
                  <span>
                    Estimated:{" "}
                    <strong className="text-slate-800 font-bold tabular-nums">
                      {formatRupiah(selectedDraftForDone.estimatedCost)}
                    </strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                    Draft locked
                  </span>
                </>
              ) : (
                <span>Scan bill receipt to deduct directly from balance</span>
              )}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={closeScanModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Sheet Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-4">
          {/* 1. SIMULATE AI RECEIPT SCANNER BOX */}
          <div className="relative bg-gradient-to-b from-emerald-50/70 to-slate-50/50 rounded-2xl border-2 border-dashed border-emerald-300/80 p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                {hasScanned ? "✨ AI Extracted from Receipt" : "Smart Receipt OCR"}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                {hasScanned ? `${scanConfidence}% confidence` : "Tap to simulate"}
              </span>
            </div>

            {isScanning ? (
              <div className="flex flex-col items-center justify-center py-5 gap-2">
                <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-emerald-800 animate-pulse">
                  Analyzing receipt image with OCR...
                </span>
              </div>
            ) : hasScanned ? (
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                <div className="w-12 h-14 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center shrink-0">
                  <Receipt className="w-6 h-6 text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-700 mt-0.5">Scanned</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {customTitle || "Scanned Merchant Bill"}
                    </h4>
                    <button
                      type="button"
                      onClick={handleSimulateScan}
                      className="text-[11px] text-emerald-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Retake
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Items detected • Tax & Service Included
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Amount verified automatically
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSimulateScan}
                className="w-full py-3.5 px-4 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-50 active:scale-[0.98] transition-all shadow-xs group"
              >
                <ScanLine className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Simulate 1-Click Scan Receipt (Auto-Fill)</span>
              </button>
            )}
          </div>

          {/* 2. ACTUAL AMOUNT INPUT */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Actual Amount Spent
              </label>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Editable
              </span>
            </div>

            <div className="relative flex items-baseline">
              <span className="text-2xl font-bold text-slate-400 mr-1.5 select-none">
                Rp
              </span>
              <input
                type="text"
                value={actualAmount}
                onChange={(e) => setActualAmount(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full text-2xl font-extrabold text-slate-900 tracking-tight bg-transparent focus:outline-none tabular-nums"
                placeholder="0"
              />
            </div>

            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Deduction impact:</span>
              <span className="font-bold text-slate-700">
                Safe-to-Spend will adjust to{" "}
                <span
                  className={
                    adjustedSafeToSpend < 0 ? "text-rose-600 font-extrabold" : "text-emerald-600"
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
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Was it worth your money?</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Mandatory Metric
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRating("worth-it")}
                className={`relative flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                  selectedRating === "worth-it"
                    ? "bg-emerald-50/80 border-2 border-emerald-500 shadow-sm scale-[1.02]"
                    : "bg-white border border-slate-200 hover:border-emerald-300"
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
                <div className="font-extrabold text-xs text-emerald-900 tracking-tight leading-tight">
                  Again!
                </div>
                <div className="text-[10px] font-medium text-emerald-700 mt-1 leading-tight">
                  Loved it / Def coming back
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRating("so-so")}
                className={`relative flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                  selectedRating === "so-so"
                    ? "bg-amber-50/80 border-2 border-amber-500 shadow-sm scale-[1.02]"
                    : "bg-white border border-slate-200 hover:border-amber-300"
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
                <div className="font-extrabold text-xs text-amber-900 tracking-tight leading-tight">
                  Sometimes
                </div>
                <div className="text-[10px] font-medium text-amber-700 mt-1 leading-tight">
                  Okay, occasionally
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRating("regret")}
                className={`relative flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                  selectedRating === "regret"
                    ? "bg-rose-50/80 border-2 border-rose-500 shadow-sm scale-[1.02]"
                    : "bg-white border border-slate-200 hover:border-rose-300"
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
                <div className="font-extrabold text-xs text-rose-900 tracking-tight leading-tight">
                  Never Again
                </div>
                <div className="text-[10px] font-medium text-rose-700 mt-1 leading-tight">
                  Waste of money / Regret
                </div>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-medium text-center mt-2">
              This rating trains your{" "}
              <strong className="text-slate-700 font-semibold">
                Mindful Flow Score (82%)
              </strong>{" "}
              and future draft insights.
            </p>
          </div>

          {/* 4. OPTIONAL REFLECTION NOTE */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Reflective Note (Optional)
            </label>
            <input
              type="text"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="e.g. Rich broth, super worth it with friends!"
              className="w-full text-xs p-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* BOTTOM ACTION AREA & PRIMARY BUTTON */}
        <div className="px-5 pt-3 pb-8 bg-white border-t border-slate-100 space-y-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={numericAmount <= 0}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 active:scale-[0.99] text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-100" />
            <span>Save Expense & Deduct Balance</span>
          </button>

          <button
            type="button"
            onClick={closeScanModal}
            className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
          >
            Keep in Drafts for Later
          </button>
        </div>
      </div>
    </div>
  );
};
