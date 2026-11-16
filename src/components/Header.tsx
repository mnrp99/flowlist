"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Bell, Sparkles, Sun, Moon, CheckCircle2 } from "lucide-react";

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    theme,
    toggleTheme,
    notificationsEnabled,
    requestNotificationPermission,
    sendNotification,
    t,
  } = useApp();

  const [showNotifToast, setShowNotifToast] = useState(false);

  const getSubtitle = () => {
    switch (activeTab) {
      case "dashboard":
        return t("nav_dashboard");
      case "drafts":
        return t("nav_drafts");
      case "insights":
        return t("nav_insights");
      case "profile":
        return t("nav_profile");
      default:
        return t("nav_dashboard");
    }
  };

  const handleNotificationClick = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setShowNotifToast(true);
        setTimeout(() => setShowNotifToast(false), 3000);
      }
    } else {
      sendNotification(
        "Notifikasi Sistem Aktif 🔔",
        "WorthIt Flow siap memberi kabar pencatatan keuangan Anda."
      );
      setShowNotifToast(true);
      setTimeout(() => setShowNotifToast(false), 2500);
    }
  };

  const displayName =
    currentUser?.username ||
    currentUser?.email?.split("@")[0] ||
    "User";

  return (
    <header className="fixed top-0 z-40 w-full max-w-[430px] bg-[#faf8ff]/90 dark:bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-colors duration-200">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Logo and Brand Title */}
        <div
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[17px] text-slate-900 dark:text-white leading-tight tracking-tight">
                WorthIt<span className="text-emerald-600 dark:text-emerald-400">.Flow</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700 text-xs hidden sm:inline">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[110px]">
                {getSubtitle()}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-extrabold">
              Hi, {displayName} 👋
            </span>
          </div>
        </div>

        {/* Action icons & Profile Avatar */}
        <div className="flex items-center gap-1.5">
          {/* Dark / Light Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Dark / Light Theme"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 active:scale-95 transition-all"
            title={theme === "dark" ? "Ganti ke Tema Terang" : "Ganti ke Tema Gelap"}
          >
            {theme === "dark" ? (
              <Sun className="w-4.5 h-4.5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-slate-700" />
            )}
          </button>

          {/* Interactive Notification Bell */}
          <button
            type="button"
            onClick={handleNotificationClick}
            aria-label="Notifications"
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/80 active:scale-95 transition-all"
            title={notificationsEnabled ? "Notifikasi Aktif (Klik untuk test)" : "Aktifkan Notifikasi"}
          >
            <Bell className="w-4.5 h-4.5" />
            {notificationsEnabled ? (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#faf8ff] dark:ring-[#070b14] animate-pulse" />
            ) : (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 ring-2 ring-[#faf8ff] dark:ring-[#070b14]" />
            )}
          </button>

          {/* Profile Tab Shortcut Avatar */}
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className="relative flex items-center justify-center active:scale-95 transition-transform"
            title="Buka Pengaturan Profil"
          >
            <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-emerald-500/40 dark:ring-emerald-400/50">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </button>
        </div>
      </div>

      {/* Floating notification status toast */}
      {showNotifToast && (
        <div className="absolute top-16 left-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            {notificationsEnabled
              ? "Notifikasi sistem aktif! Pesan uji coba telah dikirim."
              : "Izin notifikasi telah diminta."}
          </span>
        </div>
      )}
    </header>
  );
};
