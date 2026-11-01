"use client";

import React from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { DashboardScreen } from "@/components/screens/DashboardScreen";
import { DraftsScreen } from "@/components/screens/DraftsScreen";
import { InsightsScreen } from "@/components/screens/InsightsScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { CompletePlanBottomSheet } from "@/components/modals/CompletePlanBottomSheet";
import { AddDraftModal } from "@/components/modals/AddDraftModal";
import { AddIncomeBottomSheet } from "@/components/modals/AddIncomeBottomSheet";
import { Loader2, Sparkles } from "lucide-react";

function MainApp() {
  const { activeTab, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] flex flex-col items-center justify-center bg-[#faf8ff] p-6 shadow-2xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 animate-pulse">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              WorthIt<span className="text-indigo-600">.Flow</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Menghubungkan ke Supabase & Prisma...</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] flex flex-col bg-[#faf8ff] shadow-2xl overflow-x-hidden">
      {/* Top Fixed Header */}
      <Header />

      {/* Main Screen Content Viewport */}
      <main className="flex-1 w-full pt-20 px-4">
        {activeTab === "dashboard" && <DashboardScreen />}
        {activeTab === "drafts" && <DraftsScreen />}
        {activeTab === "insights" && <InsightsScreen />}
        {activeTab === "profile" && <ProfileScreen />}
      </main>

      {/* Floating Bottom Nav */}
      <BottomNav />

      {/* Modals & Overlays */}
      <CompletePlanBottomSheet />
      <AddDraftModal />
      <AddIncomeBottomSheet />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
