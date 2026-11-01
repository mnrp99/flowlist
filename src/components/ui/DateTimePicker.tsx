"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Sparkles,
} from "lucide-react";

interface DateTimePickerProps {
  value: string;
  onChange: (formattedValue: string) => void;
  label?: string;
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const FULL_DAY_NAMES = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
];

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  label = "Pilih Tanggal & Jam",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date();
  const [viewDate, setViewDate] = useState<Date>(today);
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  const [selectedHour, setSelectedHour] = useState<number>(19);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const formatDateTimeString = (
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number
  ) => {
    const targetDate = new Date(year, month, day);
    const dayName = FULL_DAY_NAMES[targetDate.getDay()];
    const monthShort = MONTH_NAMES[month].substring(0, 3);
    const padHour = String(hour).padStart(2, "0");
    const padMin = String(minute).padStart(2, "0");

    const now = new Date();
    const isToday =
      now.getDate() === day &&
      now.getMonth() === month &&
      now.getFullYear() === year;

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow =
      tomorrow.getDate() === day &&
      tomorrow.getMonth() === month &&
      tomorrow.getFullYear() === year;

    if (isToday) {
      return `Hari ini • ${padHour}:${padMin}`;
    }
    if (isTomorrow) {
      return `Besok • ${padHour}:${padMin}`;
    }

    return `${dayName}, ${day} ${monthShort} • ${padHour}:${padMin}`;
  };

  const selectToday = () => {
    const d = new Date();
    setSelectedDay(d.getDate());
    setSelectedMonth(d.getMonth());
    setSelectedYear(d.getFullYear());
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const selectTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setSelectedDay(d.getDate());
    setSelectedMonth(d.getMonth());
    setSelectedYear(d.getFullYear());
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const selectThisWeekend = () => {
    const d = new Date();
    const currentDay = d.getDay();
    const distanceToSaturday = (6 - currentDay + 7) % 7 || 7;
    d.setDate(d.getDate() + distanceToSaturday);
    setSelectedDay(d.getDate());
    setSelectedMonth(d.getMonth());
    setSelectedYear(d.getFullYear());
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const handleApply = () => {
    const result = formatDateTimeString(
      selectedYear,
      selectedMonth,
      selectedDay,
      selectedHour,
      selectedMinute
    );
    onChange(result);
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-2xl text-xs font-semibold text-slate-800 transition-all text-left shadow-2xs group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <span className="truncate">{value || "Pilih Tanggal & Jam"}</span>
        </div>
        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 w-full max-w-[390px] bg-white rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col space-y-4 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {label}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pilih tanggal & waktu kegiatan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={selectToday}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-bold shrink-0 transition-colors active:scale-95"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={selectTomorrow}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-bold shrink-0 transition-colors active:scale-95"
              >
                Besok
              </button>
              <button
                type="button"
                onClick={selectThisWeekend}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-bold shrink-0 transition-colors active:scale-95 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Weekend Ini</span>
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-extrabold text-slate-900">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-1">
                {DAY_NAMES.map((d, i) => (
                  <span key={i} className={i === 0 || i === 6 ? "text-rose-400" : ""}>
                    {d}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: firstDayIndex }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-8 w-8" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const isSelected =
                    selectedDay === dayNum &&
                    selectedMonth === currentMonth &&
                    selectedYear === currentYear;

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => {
                        setSelectedDay(dayNum);
                        setSelectedMonth(currentMonth);
                        setSelectedYear(currentYear);
                      }}
                      className={`h-8 w-8 mx-auto rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-sm scale-105"
                          : "text-slate-700 hover:bg-slate-200/70"
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pilih Jam Pelaksanaan</span>
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg tabular-nums">
                  {String(selectedHour).padStart(2, "0")}:
                  {String(selectedMinute).padStart(2, "0")} WIB
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHour(9);
                    setSelectedMinute(0);
                  }}
                  className={`py-1.5 rounded-xl border text-[11px] transition-all ${
                    selectedHour === 9 && selectedMinute === 0
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  09:00 Pagi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHour(13);
                    setSelectedMinute(0);
                  }}
                  className={`py-1.5 rounded-xl border text-[11px] transition-all ${
                    selectedHour === 13 && selectedMinute === 0
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  13:00 Siang
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHour(19);
                    setSelectedMinute(0);
                  }}
                  className={`py-1.5 rounded-xl border text-[11px] transition-all ${
                    selectedHour === 19 && selectedMinute === 0
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  19:00 Malam
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHour(20);
                    setSelectedMinute(30);
                  }}
                  className={`py-1.5 rounded-xl border text-[11px] transition-all ${
                    selectedHour === 20 && selectedMinute === 30
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  20:30 Malam
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold">Jam:</span>
                  <input
                    type="range"
                    min="0"
                    max="23"
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(Number(e.target.value))}
                    className="w-20 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 tabular-nums w-5 text-right">
                    {String(selectedHour).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold">Mnt:</span>
                  <input
                    type="range"
                    min="0"
                    max="55"
                    step="5"
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(Number(e.target.value))}
                    className="w-20 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 tabular-nums w-5 text-right">
                    {String(selectedMinute).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-extrabold rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Gunakan Jadwal Ini</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
