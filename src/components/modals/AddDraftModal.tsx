"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DraftCategory } from "@/types";
import { X, Plus, Sparkles } from "lucide-react";

export const AddDraftModal: React.FC = () => {
  const { isAddDraftModalOpen, closeAddDraftModal, addDraft } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DraftCategory>("to-go");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [tag, setTag] = useState("Wishlist");
  const [subtag, setSubtag] = useState("Dining");
  const [meta, setMeta] = useState("2 Pax");
  const [date, setDate] = useState("This Weekend");
  const [notes, setNotes] = useState("");

  if (!isAddDraftModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = Number(estimatedCost.replace(/[^0-9]/g, ""));
    if (!title.trim() || cost <= 0) return;

    let icon = "📍";
    let image = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80";

    if (category === "to-buy") {
      icon = "🛍️";
      image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80";
    } else if (category === "to-do") {
      icon = "📅";
      image = "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80";
    }

    addDraft({
      title: title.trim(),
      category,
      estimatedCost: cost,
      tag: tag || "Wishlist",
      subtag: subtag || (category === "to-go" ? "Dining" : category === "to-buy" ? "Needs" : "Experience"),
      meta: meta || "Planned",
      date: date || "Upcoming",
      icon,
      image,
      notes: notes.trim(),
    });

    // Reset and close
    setTitle("");
    setEstimatedCost("");
    closeAddDraftModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
        onClick={closeAddDraftModal}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[390px] bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col space-y-3.5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                New Mindful Draft
              </h3>
              <p className="text-[11px] text-slate-500">Lock funds before spending</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAddDraftModal}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Category Picker */}
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Category</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setCategory("to-go");
                  setSubtag("Dining");
                }}
                className={`py-2 rounded-lg font-bold transition-all ${
                  category === "to-go"
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-500"
                }`}
              >
                📍 To-Go
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory("to-buy");
                  setSubtag("Needs");
                }}
                className={`py-2 rounded-lg font-bold transition-all ${
                  category === "to-buy"
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-500"
                }`}
              >
                🛍️ To-Buy
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory("to-do");
                  setSubtag("Experiential");
                }}
                className={`py-2 rounded-lg font-bold transition-all ${
                  category === "to-do"
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-500"
                }`}
              >
                📅 To-Do
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="font-bold text-slate-700 mb-1 block">
              Item or Place Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kopi Kenangan, Sepatu Lari, Konser"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Estimated Cost */}
          <div>
            <label className="font-bold text-slate-700 mb-1 block">
              Estimated Budget (Rp)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 font-bold">Rp</span>
              <input
                type="text"
                required
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="250000"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
              />
            </div>
          </div>

          {/* Meta & Date Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 mb-1 block">
                Details / Pax
              </label>
              <input
                type="text"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                placeholder="e.g. 2 Pax, Optik Seis"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 mb-1 block">
                Date / Timing
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Sat, 20:00"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Tag */}
          <div>
            <label className="font-bold text-slate-700 mb-1 block">Source Tag</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. TikTok Saved, Shopee Wishlist, IG Saved"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Lock into Drafts</span>
          </button>
        </form>
      </div>
    </div>
  );
};
