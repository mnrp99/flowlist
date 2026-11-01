"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DraftCategory, PriorityLevel } from "@/types";
import { RupiahInput } from "@/components/ui/RupiahInput";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import {
  X,
  Plus,
  Sparkles,
  Calendar,
  AlertCircle,
  Flag,
  FileText,
  MapPin,
  ShoppingBag,
  CheckSquare,
} from "lucide-react";

export const AddDraftModal: React.FC = () => {
  const { isAddDraftModalOpen, closeAddDraftModal, addDraft } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DraftCategory>("to-go");
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [tag, setTag] = useState("TikTok Saved");
  const [subtag, setSubtag] = useState("Dining");
  const [meta, setMeta] = useState("2 Pax");
  const [dateTime, setDateTime] = useState("Sabtu, 14 Nov • 19:00");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("medium");
  const [productLink, setProductLink] = useState("");

  if (!isAddDraftModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // For To-Do, budget is strictly 0
    const finalCost = category === "to-do" ? 0 : estimatedCost;

    let icon = "📍";
    let image =
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80";

    if (category === "to-buy") {
      icon = "🛍️";
      image =
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80";
    } else if (category === "to-do") {
      icon = "📅";
      image =
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80";
    }

    addDraft({
      title: title.trim(),
      category,
      estimatedCost: finalCost,
      tag: category === "to-do" ? "Activities" : tag || "Wishlist",
      subtag: category === "to-do" ? "Activities" : subtag,
      meta: category === "to-do" ? `Prioritas: ${priority.toUpperCase()}` : meta,
      date: dateTime,
      icon,
      image,
      notes: notes.trim(),
      priority: category === "to-do" ? priority : undefined,
      link: category === "to-buy" ? productLink : undefined,
      googleCalendarUrl:
        category === "to-do" || category === "to-go"
          ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
              title
            )}&details=${encodeURIComponent(notes || "Jadwal dari WorthIt Flow")}`
          : undefined,
    });

    // Reset & close
    setTitle("");
    setEstimatedCost(0);
    setNotes("");
    setProductLink("");
    closeAddDraftModal();
  };

  const isTodo = category === "to-do";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
        onClick={closeAddDraftModal}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-[400px] bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col space-y-3.5 max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              {isTodo ? <CheckSquare className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {isTodo ? "Tambah Kegiatan (To-Do)" : "Tambah Rencana (Draft)"}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isTodo
                  ? "Pengingat kegiatan murni (Tanpa Budget)"
                  : "Kunci dana di tabungan sebelum belanja"}
              </p>
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

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* 1. Category Switcher */}
          <div>
            <label className="font-bold text-slate-800 mb-1.5 block">
              Pilih Jenis Rencana
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setCategory("to-go");
                  setSubtag("Dining");
                  setTag("TikTok Saved");
                  setMeta("2 Pax");
                }}
                className={`py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
                  category === "to-go"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>📍</span>
                <span className="truncate">To-Go</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory("to-buy");
                  setSubtag("Needs");
                  setTag("Shopee Wishlist");
                  setMeta("Kebutuhan");
                }}
                className={`py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
                  category === "to-buy"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>🛍️</span>
                <span className="truncate">To-Buy</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory("to-do");
                  setSubtag("Activities");
                  setTag("Activities");
                  setMeta("Aktivitas");
                }}
                className={`py-2 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1 ${
                  category === "to-do"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>📅</span>
                <span className="truncate">To-Do</span>
              </button>
            </div>

            {/* To-Do info pill */}
            {isTodo && (
              <div className="mt-2 p-2 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-900 text-[11px] flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>To-Do tidak memerlukan alokasi budget (Rp 0). Hanya pengingat kegiatan.</span>
              </div>
            )}
          </div>

          {/* 2. Judul Rencana / Kegiatan */}
          <div>
            <label className="font-bold text-slate-800 mb-1 block">
              {isTodo ? "Judul Kegiatan" : "Nama Tempat / Barang"}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                category === "to-go"
                  ? "Contoh: Izakaya Ramen Blok M"
                  : category === "to-buy"
                  ? "Contoh: Kacamata Minus Anti-Radiasi"
                  : "Contoh: Workshop Keramik Clay Studio"
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* 3. CONDITIONAL FIELDS: Hanya muncul di To-Go dan To-Buy (SEMBUNYI di To-Do) */}
          {!isTodo && (
            <>
              {/* Estimasi Biaya dengan Format Otomatis Thousand Separator */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-extrabold text-[11px] uppercase tracking-wider text-slate-600">
                    Estimasi Biaya yang Dikunci
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Format Titik (50.000)
                  </span>
                </div>

                <RupiahInput
                  value={estimatedCost}
                  onChange={setEstimatedCost}
                  size="lg"
                  placeholder="0"
                  required
                />
              </div>

              {/* Pax / Detail Toko */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 mb-1 block">
                    {category === "to-go" ? "Jumlah Orang (Pax)" : "Kategori Kebutuhan"}
                  </label>
                  <input
                    type="text"
                    value={meta}
                    onChange={(e) => setMeta(e.target.value)}
                    placeholder={category === "to-go" ? "3 Pax" : "Kebutuhan Kerja"}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 mb-1 block">
                    Sumber Tag
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="TikTok / Shopee / IG"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Link Produk (Khusus To-Buy) */}
              {category === "to-buy" && (
                <div>
                  <label className="font-bold text-slate-800 mb-1 block">
                    Tautan Produk (Opsional)
                  </label>
                  <input
                    type="url"
                    value={productLink}
                    onChange={(e) => setProductLink(e.target.value)}
                    placeholder="https://shopee.co.id/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}
            </>
          )}

          {/* 4. CONDITIONAL FIELDS: Prioritas Khusus To-Do */}
          {isTodo && (
            <div>
              <label className="font-bold text-slate-800 mb-1.5 block">
                Tingkat Prioritas Kegiatan
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority("high")}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    priority === "high"
                      ? "bg-rose-50 border-rose-500 text-rose-700 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>🔴</span>
                  <span>Tinggi (High)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("medium")}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    priority === "medium"
                      ? "bg-amber-50 border-amber-500 text-amber-700 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>🟡</span>
                  <span>Sedang (Med)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPriority("low")}
                  className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    priority === "low"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>🟢</span>
                  <span>Rendah (Low)</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. Pemilih Tanggal & Jam Interaktif (Visual DateTimePicker) */}
          <div>
            <label className="font-bold text-slate-800 mb-1 block">
              Jadwal Pelaksanaan (Kalender & Jam)
            </label>
            <DateTimePicker
              value={dateTime}
              onChange={setDateTime}
              label={isTodo ? "Waktu Kegiatan To-Do" : "Rencana Kunjungan / Pembelian"}
            />
          </div>

          {/* 6. Catatan (Notes) */}
          <div>
            <label className="font-bold text-slate-800 mb-1 block">
              Catatan / Pengingat (Opsional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan, dresscode, reservasi, dll..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>
              {isTodo ? "Simpan Kegiatan To-Do" : "Kunci ke Drafts & Budget"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
