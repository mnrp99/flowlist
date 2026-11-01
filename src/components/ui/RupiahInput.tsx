"use client";

import React, { useEffect, useState } from "react";

interface RupiahInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  autoFocus?: boolean;
  prefix?: string;
  size?: "sm" | "md" | "lg" | "hero";
  required?: boolean;
  disabled?: boolean;
}

export const formatThousandSeparator = (val: number | string): string => {
  if (val === "" || val === undefined || val === null) return "";
  const num = typeof val === "number" ? val : Number(String(val).replace(/[^0-9]/g, ""));
  if (isNaN(num) || num === 0) return "";
  return new Intl.NumberFormat("id-ID").format(num);
};

export const RupiahInput: React.FC<RupiahInputProps> = ({
  value,
  onChange,
  placeholder = "0",
  className = "",
  id,
  autoFocus = false,
  prefix = "Rp",
  size = "md",
  required = false,
  disabled = false,
}) => {
  const [displayText, setDisplayText] = useState<string>(() => {
    return value ? formatThousandSeparator(value) : "";
  });

  useEffect(() => {
    if (value === 0 && displayText === "") {
      return;
    }
    const currentNum = Number(displayText.replace(/[^0-9]/g, "")) || 0;
    if (value !== currentNum) {
      setDisplayText(value ? formatThousandSeparator(value) : "");
    }
  }, [value, displayText]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanDigits = rawVal.replace(/[^0-9]/g, "");

    if (!cleanDigits) {
      setDisplayText("");
      onChange(0);
      return;
    }

    const numericVal = parseInt(cleanDigits, 10);
    const formatted = new Intl.NumberFormat("id-ID").format(numericVal);
    setDisplayText(formatted);
    onChange(numericVal);
  };

  const getPrefixClass = () => {
    switch (size) {
      case "hero":
        return "text-2xl font-extrabold text-slate-400 mr-1.5 select-none";
      case "lg":
        return "text-lg font-bold text-slate-400 mr-1.5 select-none";
      case "sm":
        return "text-xs font-bold text-slate-400 mr-1 select-none";
      default:
        return "text-sm font-bold text-slate-400 mr-1.5 select-none";
    }
  };

  const getInputClass = () => {
    switch (size) {
      case "hero":
        return "w-full text-3xl font-extrabold text-slate-900 tracking-tight bg-transparent focus:outline-none tabular-nums placeholder:text-slate-300";
      case "lg":
        return "w-full text-xl font-bold text-slate-900 tracking-tight bg-transparent focus:outline-none tabular-nums placeholder:text-slate-300";
      case "sm":
        return "w-full text-xs font-semibold text-slate-900 bg-transparent focus:outline-none tabular-nums placeholder:text-slate-300";
      default:
        return "w-full text-base font-bold text-slate-900 bg-transparent focus:outline-none tabular-nums placeholder:text-slate-300";
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {prefix && <span className={getPrefixClass()}>{prefix}</span>}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoFocus={autoFocus}
        disabled={disabled}
        required={required}
        value={displayText}
        onChange={handleChange}
        placeholder={placeholder}
        className={getInputClass()}
      />
    </div>
  );
};
