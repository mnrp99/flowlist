"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  Bookmark,
  TrendingUp,
  User,
  ScanLine,
  Sparkles,
} from "lucide-react";

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, drafts, openScanModal, t } = useApp();

  return (
    <div className="fixed bottom-0 z-40 w-full max-w-[430px] pointer-events-none">
      {/* Center Floating Action Button */}
      <div className="relative flex justify-center -mb-6">
        <button
          type="button"
          onClick={() => openScanModal()}
          aria-label="Scan Receipt"
          className="pointer-events-auto flex items-center gap-1.5 px-4 h-12 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 text-white shadow-[0_10px_25px_-4px_rgba(5,150,105,0.45)] hover:shadow-[0_12px_28px_-3px_rgba(5,150,105,0.55)] active:scale-95 transition-all group ring-4 ring-[#faf8ff] dark:ring-[#070b14]"
        >
          <ScanLine className="w-5 h-5 group-hover:rotate-6 transition-transform" />
          <span className="text-xs font-extrabold tracking-tight">
            {t("scan_receipt")}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-teal-200 animate-pulse" />
        </button>
      </div>

      {/* 5-Column Navigation Bar */}
      <nav className="pointer-events-auto w-full bg-[#faf8ff]/95 dark:bg-[#070b14]/95 backdrop-blur-xl border-t border-slate-200/70 dark:border-slate-800/80 shadow-[0_-4px_25px_rgba(15,23,42,0.06)] pb-[max(env(safe-area-inset-bottom),8px)] transition-colors duration-200">
        <div className="grid grid-cols-5 items-center h-16 px-1">
          {/* 1. Home Dashboard */}
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center justify-center gap-1 h-full transition-colors cursor-pointer ${
              activeTab === "dashboard"
                ? "text-emerald-700 dark:text-emerald-400 font-extrabold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[11px] font-semibold">{t("nav_dashboard")}</span>
          </button>

          {/* 2. Drafts & Wishlist */}
          <button
            type="button"
            onClick={() => setActiveTab("drafts")}
            className={`relative flex flex-col items-center justify-center gap-1 h-full transition-colors cursor-pointer ${
              activeTab === "drafts"
                ? "text-emerald-700 dark:text-emerald-400 font-extrabold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <div className="relative">
              <Bookmark className="w-5 h-5" />
              {drafts.length > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 min-w-[16px] h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                  {drafts.length}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold">{t("nav_drafts")}</span>
          </button>

          {/* 3. Empty Center Slot for Elevated Button */}
          <div aria-hidden="true" className="flex items-center justify-center" />

          {/* 4. Insights */}
          <button
            type="button"
            onClick={() => setActiveTab("insights")}
            className={`flex flex-col items-center justify-center gap-1 h-full transition-colors cursor-pointer ${
              activeTab === "insights"
                ? "text-emerald-700 dark:text-emerald-400 font-extrabold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[11px] font-semibold">{t("nav_insights")}</span>
          </button>

          {/* 5. Profile */}
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center justify-center gap-1 h-full transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "text-emerald-700 dark:text-emerald-400 font-extrabold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[11px] font-semibold">{t("nav_profile")}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
