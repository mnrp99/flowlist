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

function MainApp() {
  const { activeTab } = useApp();

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[430px] flex flex-col bg-[#faf8ff] shadow-2xl overflow-x-hidden">
      <Header />

      <main className="flex-1 w-full pt-20 px-4">
        {activeTab === "dashboard" && <DashboardScreen />}
        {activeTab === "drafts" && <DraftsScreen />}
        {activeTab === "insights" && <InsightsScreen />}
        {activeTab === "profile" && <ProfileScreen />}
      </main>

      <BottomNav />

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
