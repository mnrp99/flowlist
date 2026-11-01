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
} from "lucide-react";

export const DraftsScreen: React.FC = () => {
  const { drafts, lockedInDrafts, openScanModal, openAddDraftModal, deleteDraft } = useApp();

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
            Guard your budget before spending
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSortBy(sortBy === "date" ? "cost" : "date")}
            aria-label="Sort drafts"
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            title={`Sorting by: ${sortBy === "date" ? "Date" : "Cost"}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
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

      {/* 3. SUMMARY METRIC BANNER */}
      <section className="w-full">
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
              {drafts.length} Plans Active
            </span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5" />
              Pre-approved
            </span>
          </div>
        </div>
      </section>

      {/* 4. ACTIONS & SORT BAR */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setSortBy(sortBy === "date" ? "cost" : "date")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 text-xs font-semibold shadow-2xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
          <span>Sort: {sortBy === "date" ? "Date" : "Cost (High to Low)"}</span>
        </button>

        <button
          type="button"
          onClick={openAddDraftModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Draft</span>
        </button>
      </div>

      {/* 5. DRAFT CARDS FEED */}
      <div className="flex flex-col gap-3.5 w-full">
        {sortedDrafts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 flex flex-col items-center gap-2">
            <span className="text-3xl">📝</span>
            <h4 className="text-sm font-bold text-slate-800">No Drafts in this tab</h4>
            <p className="text-xs text-slate-500 max-w-[220px]">
              Tap &apos;Add Draft&apos; to reserve funds for your next place, item, or activity!
            </p>
            <button
              type="button"
              onClick={openAddDraftModal}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700"
            >
              + Create New Draft
            </button>
          </div>
        ) : (
          sortedDrafts.map((draft) => (
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

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
                {/* Calendar or Link button */}
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
                    title="Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Mark Done / Scan Bill button */}
                <button
                  type="button"
                  onClick={() => openScanModal(draft)}
                  className="flex-1 h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="truncate">Mark Done / Scan Bill</span>
                </button>

                {/* Additional delete button if calendar/link is present */}
                {(draft.googleCalendarUrl || draft.link) && (
                  <button
                    type="button"
                    onClick={() => deleteDraft(draft.id)}
                    className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      {/* 6. MINDFUL BUDGET COACH FOOTER TIP */}
      <section className="mt-2 p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200/50 flex items-start gap-2.5">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-800">Mindful Tip</span>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Items staying over 14 days in Drafts have a 68% chance of not actually being needed. Review before moving to real spend!
          </p>
        </div>
      </section>
    </div>
  );
};
