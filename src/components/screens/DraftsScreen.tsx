"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { DraftCategory } from "@/types";
import { formatRupiah } from "@/utils/format";
import {
  Lock,
  Plus,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Trash2,
  Lightbulb,
  ArrowUpDown,
  BookmarkCheck,
  Check,
  CheckSquare,
  Clock,
  Filter,
  X,
} from "lucide-react";

export const DraftsScreen: React.FC = () => {
  const {
    drafts,
    lockedInDrafts,
    openScanModal,
    openAddDraftModal,
    deleteDraft,
    toggleTodoCompleted,
    t,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<DraftCategory>("to-go");
  // Date filter: empty string means "Real-Time / All Dates (default)"
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");

  // Helper dates (ISO YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  // Request 2: Exclude completed drafts completely so they never show up again
  const activeDrafts = useMemo(() => {
    return drafts.filter((d) => !d.completed && d.category === selectedCategory);
  }, [drafts, selectedCategory]);

  // Request 3: Filter by selected date, and if none selected, default to real-time (newest first)
  const filteredAndSortedDrafts = useMemo(() => {
    let result = [...activeDrafts];

    if (selectedDateFilter) {
      result = result.filter((item) => {
        if (!item.date) return false;
        // Match either ISO substring or formatted date
        return item.date.startsWith(selectedDateFilter) || item.date.includes(selectedDateFilter);
      });
    }

    // Default real-time: newest timestamp first
    result.sort((a, b) => {
      const timeA = new Date(a.date).getTime() || 0;
      const timeB = new Date(b.date).getTime() || 0;
      return timeB - timeA;
    });

    return result;
  }, [activeDrafts, selectedDateFilter]);

  const isTodoTab = selectedCategory === "to-do";

  // Google calendar generator helper
  const getGoogleCalendarUrl = (draft: { title: string; date: string; notes?: string }) => {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      draft.title
    )}&details=${encodeURIComponent(draft.notes || "Pengingat dari WorthIt Flow")}`;
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "high":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-[10px] font-bold border border-rose-200 dark:border-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Prioritas Tinggi
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Prioritas Rendah
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Prioritas Sedang
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 space-y-4">
      {/* 1. TOP TITLE & CONTROLS */}
      <section className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t("drafts_title")}
            </h1>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
              {activeDrafts.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isTodoTab
              ? "Jadwal & pengingat aktivitas harian"
              : "Kunci dana di tabungan sebelum belanja"}
          </p>
        </div>

        <button
          type="button"
          onClick={openAddDraftModal}
          aria-label="Add draft"
          className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center transition-all shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-5 h-5" />
        </button>
      </section>

      {/* 2. SEGMENTED CONTROL (3 Category Tabs) */}
      <section className="w-full">
        <div
          className="grid grid-cols-3 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 gap-1 transition-colors"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "to-go"}
            onClick={() => setSelectedCategory("to-go")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "to-go"
                ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="text-sm">📍</span>
            <span className="truncate">{t("tab_togo")}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "to-buy"}
            onClick={() => setSelectedCategory("to-buy")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "to-buy"
                ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="text-sm">🛍️</span>
            <span className="truncate">{t("tab_tobuy")}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "to-do"}
            onClick={() => setSelectedCategory("to-do")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "to-do"
                ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="text-sm">📅</span>
            <span className="truncate">{t("tab_todo")}</span>
          </button>
        </div>
      </section>

      {/* 3. SUMMARY METRIC BANNER */}
      <section className="w-full">
        {!isTodoTab ? (
          <div className="w-full rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/25 dark:border-emerald-800/60 p-3.5 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Lock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
                  {t("locked_in_drafts")}
                </span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white leading-tight tabular-nums">
                  {formatRupiah(lockedInDrafts)}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {activeDrafts.length} Rencana Terkunci
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5" />
                Pre-approved
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 p-3.5 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 dark:text-blue-400">
                  Kegiatan Aktif (To-Do)
                </span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  {activeDrafts.length} Agenda Tersedia
                </span>
              </div>
            </div>
            <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold bg-white dark:bg-blue-900/60 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-700 shadow-2xs">
              Murni Kegiatan (Rp 0)
            </span>
          </div>
        )}
      </section>

      {/* 4. Request 3: DATE FILTER & REAL-TIME SORT BAR */}
      <section className="flex flex-col space-y-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Filter className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Filter Tanggal:</span>
          </div>

          {selectedDateFilter ? (
            <button
              type="button"
              onClick={() => setSelectedDateFilter("")}
              className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset ke Real-Time</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Real-Time (Terbaru)</span>
            </span>
          )}
        </div>

        {/* Quick Date Chips & Visual Date Picker */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedDateFilter("")}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedDateFilter === ""
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Semua (Real-Time)
          </button>

          <button
            type="button"
            onClick={() => setSelectedDateFilter(todayStr)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedDateFilter === todayStr
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Hari Ini
          </button>

          <button
            type="button"
            onClick={() => setSelectedDateFilter(tomorrowStr)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedDateFilter === tomorrowStr
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Besok
          </button>

          {/* Interactive Date Picker input */}
          <div className="relative inline-flex items-center">
            <input
              type="date"
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="text-xs font-semibold py-1 px-2.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
              title="Pilih tanggal khusus"
            />
          </div>
        </div>
      </section>

      {/* 5. DRAFT CARDS FEED */}
      <div className="flex flex-col gap-3.5 w-full">
        {filteredAndSortedDrafts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/70 dark:border-slate-800 flex flex-col items-center gap-2 transition-colors">
            <span className="text-3xl">{isTodoTab ? "📅" : "📝"}</span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">
              {selectedDateFilter
                ? `Tidak Ada Jadwal pada Tanggal Ini (${selectedDateFilter})`
                : isTodoTab
                ? "Belum Ada Jadwal Kegiatan"
                : "Belum Ada Rencana di Tab Ini"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px]">
              {selectedDateFilter
                ? "Coba ganti filter tanggal atau kembali ke mode Real-Time."
                : isTodoTab
                ? "Tambahkan kegiatan baru untuk pengingat hari ini atau akhir pekan."
                : "Kunci dana di tabungan sebelum Anda mengunjungi tempat atau membeli barang."}
            </p>
            {selectedDateFilter ? (
              <button
                type="button"
                onClick={() => setSelectedDateFilter("")}
                className="mt-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-full text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                Tampilkan Semua (Real-Time)
              </button>
            ) : (
              <button
                type="button"
                onClick={openAddDraftModal}
                className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 cursor-pointer"
              >
                {isTodoTab ? "+ Buat Kegiatan Baru" : "+ Create New Draft"}
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedDrafts.map((draft) => {
            // === A. TAMPILAN KHUSUS KARTU TO-DO (ACTIVITIES) ===
            if (isTodoTab) {
              return (
                <article
                  key={draft.id}
                  className="flex flex-col p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox Interaktif 1-Klik: Request 2: langsung hapus/selesaikan */}
                    <button
                      type="button"
                      onClick={() => toggleTodoCompleted(draft.id)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 bg-white dark:bg-slate-800 cursor-pointer active:scale-90 transition-transform"
                      title="Klik untuk tandai selesai (otomatis dihapus dari draft)"
                    >
                      <Check className="w-4 h-4 stroke-[3] text-transparent hover:text-emerald-500" />
                    </button>

                    {/* Konten To-Do */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        {getPriorityBadge(draft.priority)}
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{draft.date}</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {draft.title}
                      </h3>

                      {draft.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {draft.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tombol Aksi To-Do (Add to Google Calendar & Hapus) */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={draft.googleCalendarUrl || getGoogleCalendarUrl(draft)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Add to Google Calendar</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => deleteDraft(draft.id)}
                      className="h-8 w-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      title="Hapus Kegiatan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            }

            // === B. TAMPILAN KARTU TO-GO / TO-BUY (WITH BUDGET) ===
            return (
              <article
                key={draft.id}
                className="flex flex-col p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative group"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  {draft.image ? (
                    <img
                      alt={draft.title}
                      src={draft.image}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                      <span className="text-2xl">{draft.icon}</span>
                      <span className="text-[10px] font-bold mt-1 text-slate-500 dark:text-slate-400 capitalize">
                        {draft.subtag}
                      </span>
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                        {draft.tag}
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                        {draft.subtag}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {draft.title}
                    </h3>

                    {/* Estimasi Biaya */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {draft.meta} • Est.{" "}
                      <strong className="text-slate-900 dark:text-white font-bold tabular-nums">
                        {formatRupiah(draft.estimatedCost)}
                      </strong>
                    </p>

                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mt-1">
                      <span className="text-xs">🗓️</span>
                      <span className="text-[11px] truncate">
                        {draft.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Calendar/Link + Mark Done / Scan Bill */}
                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  {draft.googleCalendarUrl ? (
                    <a
                      href={draft.googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Calendar</span>
                    </a>
                  ) : draft.link ? (
                    <a
                      href={draft.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Link</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => deleteDraft(draft.id)}
                      className="h-9 px-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 flex items-center justify-center transition-colors cursor-pointer"
                      title="Hapus Draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Tombol Mark Done / Scan Bill */}
                  <button
                    type="button"
                    onClick={() => openScanModal(draft)}
                    className="flex-1 h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="truncate">Mark Done / Scan Bill</span>
                  </button>

                  {(draft.googleCalendarUrl || draft.link) && (
                    <button
                      type="button"
                      onClick={() => deleteDraft(draft.id)}
                      className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      title="Hapus Draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* 6. MINDFUL BUDGET COACH FOOTER TIP */}
      <section className="mt-2 p-3.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5 transition-colors">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800 dark:text-white">Mindful Tip</span>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
            {isTodoTab
              ? "Kegiatan yang dijadwalkan secara sadar membantu Anda menikmati hidup tanpa stres pengeluaran dadakan."
              : "Rencana yang bertahan lebih dari 14 hari di Drafts memiliki peluang 68% sebenarnya tidak terlalu Anda butuhkan. Pertimbangkan kembali sebelum transaksi nyata!"}
          </p>
        </div>
      </section>
    </div>
  );
};
