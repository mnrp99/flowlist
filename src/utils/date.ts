const INDO_MONTHS: Record<string, number> = {
  jan: 0,
  januari: 0,
  feb: 1,
  februari: 1,
  mar: 2,
  maret: 2,
  apr: 3,
  april: 3,
  mei: 4,
  jun: 5,
  juni: 5,
  jul: 6,
  juli: 6,
  agu: 7,
  ags: 7,
  agustus: 7,
  sep: 8,
  september: 8,
  okt: 9,
  oktober: 9,
  nov: 10,
  november: 10,
  des: 11,
  desember: 11,
};

/**
 * Safely parse Indonesian formatted date-time string (e.g. "Sabtu, 14 Nov • 19:00", "Hari ini • Baru saja")
 * or standard ISO date strings into a valid JavaScript Date object.
 */
export function parseIndonesianDate(input?: string | null): Date | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 1. Try native Date parser (works for ISO strings like "2026-11-14T19:00:00.000Z")
  const native = new Date(trimmed);
  if (!isNaN(native.getTime())) {
    return native;
  }

  const now = new Date();
  const lower = trimmed.toLowerCase();

  // Extract time "HH:mm" from string if present (e.g. "• 19:00" or "19.30")
  const timeMatch = trimmed.match(/(\d{1,2})[:.](\d{2})/);
  let hour = now.getHours();
  let minute = now.getMinutes();
  if (timeMatch) {
    hour = parseInt(timeMatch[1], 10);
    minute = parseInt(timeMatch[2], 10);
  }

  // 2. Relative "hari ini"
  if (lower.includes("hari ini")) {
    const d = new Date(now);
    d.setHours(hour, minute, 0, 0);
    return d;
  }

  // 3. Relative "besok"
  if (lower.includes("besok")) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    d.setHours(hour, minute, 0, 0);
    return d;
  }

  // 4. Pattern like "Sabtu, 14 Nov • 19:00" or "14 Nov" or "14 November 2026"
  const patternMatch = lower.match(/(\d{1,2})\s+([a-z]+)/);
  if (patternMatch) {
    const day = parseInt(patternMatch[1], 10);
    const rawMonth = patternMatch[2];
    const monthKey = rawMonth.substring(0, 3);
    const monthIndex = INDO_MONTHS[rawMonth] ?? INDO_MONTHS[monthKey];

    if (monthIndex !== undefined && day >= 1 && day <= 31) {
      let year = now.getFullYear();
      const yearMatch = trimmed.match(/\b(20\d\d)\b/);
      if (yearMatch) {
        year = parseInt(yearMatch[1], 10);
      }
      const d = new Date(year, monthIndex, day, hour, minute, 0, 0);
      if (!isNaN(d.getTime())) {
        return d;
      }
    }
  }

  return null;
}

/**
 * Guaranteed to return a valid Date object for transactions.
 * Fallback to current time (new Date()) if invalid, so Prisma never receives Invalid Date.
 */
export function parseTransactionDate(input?: string | null): Date {
  const parsed = parseIndonesianDate(input);
  if (parsed && !isNaN(parsed.getTime())) {
    return parsed;
  }
  return new Date();
}

/**
 * Guaranteed to return either a valid Date or null for plan targetDate.
 * Never returns Invalid Date.
 */
export function parsePlanTargetDate(input?: string | null): Date | null {
  const parsed = parseIndonesianDate(input);
  if (parsed && !isNaN(parsed.getTime())) {
    return parsed;
  }
  return null;
}
