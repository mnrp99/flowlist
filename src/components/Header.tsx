"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Bell, Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  const { activeTab } = useApp();

  const getSubtitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "drafts":
        return "Drafts & Wishlist";
      case "insights":
        return "Financial Insights";
      case "profile":
        return "Settings & Profile";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="fixed top-0 z-40 w-full max-w-[430px] bg-[#faf8ff]/85 backdrop-blur-xl border-b border-slate-100 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <Sparkles className="w-5 h-5 text-emerald-100" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[17px] text-slate-900 leading-tight tracking-tight">
                WorthIt Flow
              </span>
              <span className="text-slate-300 text-xs hidden sm:inline">•</span>
              <span className="text-xs text-slate-500 font-semibold truncate max-w-[120px]">
                {getSubtitle()}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">
              Hi, Rian 👋
            </span>
          </div>
        </div>

        {/* Action icons & Profile Avatar */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#faf8ff]"></span>
          </button>
          
          <div className="relative flex items-center justify-center">
            <img
              alt="Profile Avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30 shadow-sm"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
