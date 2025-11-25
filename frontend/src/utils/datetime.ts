// src/utils/datetime.ts

/**
 * Parse "YYYY-MM-DD" en Date locale (évite l'interprétation UTC de new Date("YYYY-MM-DD")).
 */
export function parseYMDLocal(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0);
}

/**
 * Parse "YYYY-MM-DDTHH:mm:ss" (ou "YYYY-MM-DD HH:mm:ss") en Date locale,
 * SANS basculer en UTC (pas de 'Z').
 */
export function parseLocalDateTime(localStr: string): Date {
  const s = localStr.replace(" ", "T");
  const [datePart, timePart = "00:00:00"] = s.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh = 0, mm = 0, ss = 0] = timePart.split(":").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh, mm, ss);
}

/** Format: "lun. 27 oct. 2025" */
export function formatShortDate(d: Date, locale: string = "fr-FR") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Format: "19:28" */
export function formatTimeHM(d: Date, locale: string = "fr-FR") {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

/**
 * Construit "lun. 27 oct. 2025 • 19:28–20:28" à partir de deux chaînes locales.
 * Attend des valeurs SANS 'Z' : "YYYY-MM-DDTHH:mm:ss".
 */
export function formatRangeLocal(dateDebutStr: string, dateFinStr: string, locale: string = "fr-FR") {
  const d1 = parseLocalDateTime(dateDebutStr);
  const d2 = parseLocalDateTime(dateFinStr);
  const dateLabel = formatShortDate(d1, locale);
  const start = formatTimeHM(d1, locale);
  const end = formatTimeHM(d2, locale);
  return `${dateLabel} • ${start}–${end}`;
}
