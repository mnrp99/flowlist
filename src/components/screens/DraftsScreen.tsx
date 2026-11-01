"use client";

import React, { useState } from "react";
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
  SlidersHorizontal,
  BookmarkCheck,
  Check,
  CheckSquare,
  Square,
  Clock,
  Flag,
} from "lucide-react";

export const DraftsScreen: React.FC = () => {
  const {
    drafts,
    lockedInDrafts,
    openScanModal,
    openAddDraftModal,
    deleteDraft,
    toggleTodoCompleted,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<DraftCategory>("to-go");
  const [sortBy, setSortBy] = useState<"date" | "cost">("date");

  // Filter drafts by category
  const filteredDrafts = drafts.filter((d) => d.category === selectedCategory);

  // Sort drafts
  const sortedDrafts = [...filteredDrafts].sort((a, b) => {
    if (sortBy === "cost") {
      return b.estimatedCost - a.estimatedCost;
    }
    return 0; // default order
  });

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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Prioritas Tinggi
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Prioritas Rendah
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Drafts & Wishlist
            </h1>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
              {drafts.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTodoTab
              ? "Jadwal & pengingat aktivitas harian"
              : "Kunci dana di tabungan sebelum belanja"}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {!isTodoTab && (
            <button
              type="button"
              onClick={() => setSortBy(sortBy === "date" ? "cost" : "date")}
              aria-label="Sort drafts"
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title={`Sorting by: ${sortBy === "date" ? "Date" : "Cost"}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={openAddDraftModal}
            aria-label="Add draft"
            className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* 2. SEGMENTED CONTROL (3 Category Tabs) */}
      <section className="w-full">
        <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-100 gap-1" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "to-go"}
            onClick={() => setSelectedCategory("to-go")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === "to-go"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="text-sm">📍</span>
            <span className="truncate">To-Go</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "to-buy"}
            onClick={() => setSelectedCategory("to-buy")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === "to-buy"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="text-sm">🛍️</span>
            <span className="truncate">To-Buy</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "to-do"}
            onClick={() => setSelectedCategory("to-do")}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === "to-do"
                ? "bg-white text-emerald-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="text-sm">📅</span>
            <span className="truncate">To-Do</span>
          </button>
        </div>
      </section>

      {/* 3. SUMMARY METRIC BANNER (Only shows locked money for To-Go & To-Buy, or To-Do Activity summary) */}
      <section className="w-full">
        {!isTodoTab ? (
          <div className="w-full rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Lock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                  Locked in Drafts
                </span>
                <span className="text-base font-extrabold text-slate-900 leading-tight tabular-nums">
                  {formatRupiah(lockedInDrafts)}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-semibold text-slate-500">
                {drafts.filter((d) => d.category !== "to-do").length} Rencana Terkunci
              </span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5" />
                Pre-approved
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-2xl bg-blue-50 border border-blue-200/70 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700">
                  Kegiatan Aktif (To-Do)
                </span>
                <span className="text-base font-extrabold text-slate-900 leading-tight">
                  {filteredDrafts.filter((d) => !d.completed).length} Pending /{" "}
                  {filteredDrafts.filter((d) => d.completed).length} Selesai
                </span>
              </div>
            </div>
            <span className="text-xs text-blue-700 font-semibold bg-white px-2.5 py-1 rounded-full border border-blue-200 shadow-2xs">
              Murni Kegiatan (Rp 0)
            </span>
          </div>
        )}
      </section>

      {/* 4. ACTIONS & SORT BAR */}
      <div className="flex items-center justify-between gap-2">
        {!isTodoTab ? (
          <button
            type="button"
            onClick={() => setSortBy(sortBy === "date" ? "cost" : "date")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 text-xs font-semibold shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            <span>Sort: {sortBy === "date" ? "Tanggal" : "Biaya Tertinggi"}</span>
          </button>
        ) : (
          <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <span>Daftar Agenda & Tugas</span>
          </div>
        )}

        <button
          type="button"
          onClick={openAddDraftModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          <span>{isTodoTab ? "+ Tambah Kegiatan" : "+ Add Draft"}</span>
        </button>
      </div>

      {/* 5. DRAFT CARDS FEED */}
      <div className="flex flex-col gap-3.5 w-full">
        {sortedDrafts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 flex flex-col items-center gap-2">
            <span className="text-3xl">{isTodoTab ? "📅" : "📝"}</span>
            <h4 className="text-sm font-bold text-slate-800">
              {isTodoTab ? "Belum Ada Jadwal Kegiatan" : "Belum Ada Rencana di Tab Ini"}
            </h4>
            <p className="text-xs text-slate-500 max-w-[240px]">
              {isTodoTab
                ? "Tambahkan kegiatan baru untuk pengingat hari ini atau akhir pekan."
                : "Kunci dana di tabungan sebelum Anda mengunjungi tempat atau membeli barang."}
            </p>
            <button
              type="button"
              onClick={openAddDraftModal}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700"
            >
              {isTodoTab ? "+ Buat Kegiatan Baru" : "+ Create New Draft"}
            </button>
          </div>
        ) : (
          sortedDrafts.map((draft) => {
            const isCompleted = draft.completed || false;

            // === A. TAMPILAN KHUSUS KARTU TO-DO (ACTIVITIES) ===
            if (isTodoTab) {
              return (
                <article
                  key={draft.id}
                  className={`flex flex-col p-4 rounded-2xl bg-white border transition-all ${
                    isCompleted
                      ? "border-emerald-200/80 bg-emerald-50/20 opacity-80"
                      : "border-slate-100 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox Interaktif 1-Klik */}
                    <button
                      type="button"
                      onClick={() => toggleTodoCompleted(draft.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isCompleted
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "border-2 border-slate-300 hover:border-emerald-500 bg-white"
                      }`}
                      title={isCompleted ? "Tandai belum selesai" : "Tandai selesai"}
                    >
                      {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    {/* Konten To-Do */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        {getPriorityBadge(draft.priority)}
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{draft.date}</span>
                        </span>
                      </div>

                      <h3
                        className={`text-sm font-bold text-slate-900 leading-snug ${
                          isCompleted ? "line-through text-slate-400" : ""
                        }`}
                      >
                        {draft.title}
                      </h3>

                      {draft.notes && (
                        <p
                          className={`text-xs text-slate-500 mt-1 leading-relaxed ${
                            isCompleted ? "line-through text-slate-400" : ""
                          }`}
                        >
                          {draft.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tombol Aksi To-Do (Add to Google Calendar & Hapus) */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100">
                    <a
                      href={draft.googleCalendarUrl || getGoogleCalendarUrl(draft)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Add to Google Calendar</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => deleteDraft(draft.id)}
                      className="h-8 w-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0"
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
                className="flex flex-col p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  {draft.image ? (
                    <img
                      alt={draft.title}
                      src={draft.image}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-slate-100 flex flex-col items-center justify-center shrink-0 text-slate-700">
                      <span className="text-2xl">{draft.icon}</span>
                      <span className="text-[10px] font-bold mt-1 text-slate-500 capitalize">
                        {draft.subtag}
                      </span>
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {draft.tag}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                        {draft.subtag}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {draft.title}
                    </h3>

                    {/* Estimasi Biaya */}
                    <p className="text-xs text-slate-500 mt-0.5">
                      {draft.meta} • Est.{" "}
                      <strong className="text-slate-900 font-bold tabular-nums">
                        {formatRupiah(draft.estimatedCost)}
                      </strong>
                    </p>

                    <div className="flex items-center gap-1 text-slate-500 mt-1">
                      <span className="text-xs">🗓️</span>
                      <span className="text-[11px] text-slate-500 truncate">
                        {draft.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Calendar/Link + Mark Done / Scan Bill */}
                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
                  {draft.googleCalendarUrl ? (
                    <a
                      href={draft.googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 px-3 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>Calendar</span>
                    </a>
                  ) : draft.link ? (
                    <a
                      href={draft.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 px-3 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-emerald-600" />
                      <span>Link</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => deleteDraft(draft.id)}
                      className="h-9 px-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors"
                      title="Hapus Draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {/* Tombol Mark Done / Scan Bill */}
                  <button
                    type="button"
                    onClick={() => openScanModal(draft)}
                    className="flex-1 h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="truncate">Mark Done / Scan Bill</span>
                  </button>

                  {(draft.googleCalendarUrl || draft.link) && (
                    <button
                      type="button"
                      onClick={() => deleteDraft(draft.id)}
                      className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0"
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
      <section className="mt-2 p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200/50 flex items-start gap-2.5">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800">Mindful Tip</span>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            {isTodoTab
              ? "Kegiatan yang dijadwalkan secara sadar membantu Anda menikmati hidup tanpa stres pengeluaran dadakan."
              : "Rencana yang bertahan lebih dari 14 hari di Drafts memiliki peluang 68% sebenarnya tidak terlalu Anda butuhkan. Pertimbangkan kembali sebelum transaksi nyata!"}
          </p>
        </div>
      </section>
    </div>
  );
};
