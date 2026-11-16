"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { RupiahInput } from "@/components/ui/RupiahInput";
import { POPULAR_100_LANGUAGES, LanguageItem } from "@/utils/i18n";
import {
  Wallet,
  Sparkles,
  CheckCircle,
  LogOut,
  Mail,
  Database,
  RefreshCw,
  Loader2,
  Moon,
  Sun,
  Bell,
  Globe,
  User,
  KeyRound,
  Edit3,
  X,
  Check,
  Search,
  AlertCircle,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    realBalance,
    updateRealBalance,
    refreshData,
    drafts,
    transactions,
    logout,
    isSyncing,
    theme,
    setTheme,
    language,
    setLanguage,
    t,
    notificationsEnabled,
    requestNotificationPermission,
    sendNotification,
    updateUserProfile,
  } = useApp();

  const [balanceInput, setBalanceInput] = useState<number>(realBalance);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Edit profile modal state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Language modal state
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");

  // Notification test status
  const [notifNotice, setNotifNotice] = useState<string | null>(null);

  // Sync balance input with real balance
  useEffect(() => {
    setBalanceInput(realBalance);
  }, [realBalance]);

  // Populate edit fields when opening edit modal
  useEffect(() => {
    if (currentUser) {
      setEditUsername(currentUser.username || currentUser.email?.split("@")[0] || "");
      setEditEmail(currentUser.email || "");
      setEditPassword("");
    }
  }, [currentUser, isEditProfileOpen]);

  // Current language object
  const currentLangObj = useMemo(() => {
    return (
      POPULAR_100_LANGUAGES.find((l) => l.code === language) || {
        code: "id",
        name: "Indonesian",
        nativeName: "Bahasa Indonesia",
        flag: "🇮🇩",
      }
    );
  }, [language]);

  // Filter 100 languages by search
  const filteredLanguages = useMemo(() => {
    if (!langSearch.trim()) return POPULAR_100_LANGUAGES;
    const q = langSearch.toLowerCase();
    return POPULAR_100_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [langSearch]);

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (balanceInput >= 0) {
      await updateRealBalance(balanceInput);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2000);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg(null);

    const res = await updateUserProfile({
      username: editUsername,
      email: editEmail,
      password: editPassword || undefined,
    });

    setIsUpdatingProfile(false);

    if (res.success) {
      setProfileMsg({
        type: "success",
        text: "Profil berhasil diperbarui!",
      });
      setTimeout(() => {
        setIsEditProfileOpen(false);
        setProfileMsg(null);
      }, 1500);
    } else {
      setProfileMsg({
        type: "error",
        text: res.error || "Gagal memperbarui profil.",
      });
    }
  };

  const handleToggleNotification = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotifNotice("Notifikasi berhasil diaktifkan!");
      } else {
        setNotifNotice("Izin notifikasi ditolak oleh browser.");
      }
    } else {
      sendNotification(
        "Tes Notifikasi WorthIt Flow 🚀",
        "Sistem notifikasi berjalan lancar di browser Anda!"
      );
      setNotifNotice("Pesan notifikasi uji coba terkirim!");
    }
    setTimeout(() => setNotifNotice(null), 3000);
  };

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari akun?")) {
      setIsLoggingOut(true);
      await logout();
    }
  };

  const displayName =
    currentUser?.username ||
    currentUser?.email?.split("@")[0] ||
    "Akun Saya";

  return (
    <div className="flex flex-col w-full pb-28 space-y-4 animate-in fade-in duration-200">
      {/* 1. Profile Header Card */}
      <section className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 transition-colors relative overflow-hidden">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-15 h-15 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900">
              ✓
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight truncate">
              {displayName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1 truncate">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{currentUser?.email || "Tidak ada email"}</span>
            </p>
            <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200/60 dark:border-indigo-800/60">
              <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span>Supabase Auth Verified</span>
            </div>
          </div>
        </div>

        {/* Request 5: Edit Profile Button */}
        <button
          type="button"
          onClick={() => setIsEditProfileOpen(true)}
          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </section>

      {/* 2. Request 1: THEME SELECTION (Dark & Light Mode) */}
      <section className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="w-4 h-4 text-amber-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t("theme")}
            </h3>
          </div>
          <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
            {theme === "dark" ? t("theme_dark") : t("theme_light")}
          </span>
        </div>

        {/* Segmented Dual Switch for Theme */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 gap-1">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              theme === "light"
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{t("theme_light")}</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              theme === "dark"
                ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Moon className="w-4 h-4 text-amber-400" />
            <span>{t("theme_dark")}</span>
          </button>
        </div>
      </section>

      {/* 3. Request 6: SYSTEM NOTIFICATIONS (Notification API) */}
      <section className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t("notifications")}
            </h3>
          </div>
          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
              notificationsEnabled
                ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            {notificationsEnabled ? "Aktif" : "Nonaktif"}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Aktifkan notifikasi browser untuk menerima pemberitahuan otomatis saat rencana selesai, pemasukan masuk, atau saldo bertambah.
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleNotification}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
              notificationsEnabled
                ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>
              {notificationsEnabled ? t("test_notification") : "Aktifkan Notifikasi"}
            </span>
          </button>
        </div>

        {notifNotice && (
          <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{notifNotice}</span>
          </p>
        )}
      </section>

      {/* 4. Request 7: 100 LANGUAGES SELECTOR */}
      <section className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t("language")} (100 Bahasa)
            </h3>
          </div>
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <span>{currentLangObj.flag}</span>
            <span>{currentLangObj.nativeName}</span>
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Pilih dari 100 bahasa terpopuler di dunia (termasuk Bahasa Indonesia, English, Jawa, Sunda, dll).
        </p>

        <button
          type="button"
          onClick={() => {
            setLangSearch("");
            setIsLangModalOpen(true);
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{currentLangObj.flag}</span>
            <span>
              {currentLangObj.nativeName} ({currentLangObj.name})
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            Ganti Bahasa →
          </span>
        </button>
      </section>

      {/* 5. Simulation & Balance Controls dengan RupiahInput */}
      <section className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Simulasi Saldo Kas (Real Balance)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => refreshData()}
            disabled={isSyncing}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Ubah saldo kas aktif untuk menguji dinamika Safe-to-Spend (saldo aman setelah dikurangi alokasi draft rencana).
        </p>

        <form onSubmit={handleUpdateBalance} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
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
              disabled={isSyncing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-60 cursor-pointer"
            >
              Update
            </button>
          </div>
          {isSavedNotice && (
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Saldo di database Supabase berhasil diperbarui!
            </p>
          )}
        </form>
      </section>

      {/* 6. Database & App Stats Summary */}
      <section className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm space-y-2.5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Database Prisma v6
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">
              Draft Plans Aktif
            </span>
            <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
              {drafts.length} Item
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">
              Transaksi di DB
            </span>
            <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
              {transactions.length} Data
            </p>
          </div>
        </div>
      </section>

      {/* 7. Logout Section */}
      <section className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {t("logout")}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Akhiri sesi Supabase Auth
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/70 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {isLoggingOut ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LogOut className="w-3.5 h-3.5" />
          )}
          <span>Keluar</span>
        </button>
      </section>

      {/* 8. PWA Info Box */}
      <section className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3 transition-colors">
        <Smartphone className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong className="text-slate-900 dark:text-white font-bold block mb-0.5">
            Progressive Web App (PWA) Ready
          </strong>
          Anda dapat menambahkan WorthIt Flow ke layar utama smartphone (Add to Home Screen) di iOS / Android.
        </div>
      </section>

      {/* ================= MODAL 1: EDIT PROFILE ================= */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-[390px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t("edit_profile")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              {/* Username */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {t("username")}
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {t("email")}
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {t("new_password")}
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Kosongkan bila tidak ingin ganti"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {profileMsg && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    profileMsg.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                  }`}
                >
                  {profileMsg.type === "success" ? (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-60 cursor-pointer shadow-sm"
                >
                  {isUpdatingProfile ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{t("save_changes")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: 100 LANGUAGES PICKER ================= */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-[390px] h-[520px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pilih Bahasa (100 Bahasa)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLangModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="my-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                placeholder="Cari bahasa (Indonesia, English, dll)..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Scrollable Language List */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 no-scrollbar">
              {filteredLanguages.map((l: LanguageItem) => {
                const isSelected = l.code === language;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      setIsLangModalOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors text-left cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{l.flag}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold leading-tight">
                          {l.nativeName}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {l.name} ({l.code})
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
