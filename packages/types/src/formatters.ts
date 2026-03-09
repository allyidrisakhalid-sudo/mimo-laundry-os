export type SupportedLocale = "en" | "sw";

export function formatMoneyTzs(amount: number, locale: SupportedLocale = "en"): string {
  const formatted = new Intl.NumberFormat(locale === "sw" ? "sw-TZ" : "en-TZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `TZS ${formatted}`;
}

export function formatDateTime(value: Date | string, locale: SupportedLocale = "en"): string {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat(locale === "sw" ? "sw-TZ" : "en-TZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatPhoneTz(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  let local = digits;

  if (digits.startsWith("255")) {
    local = digits.slice(3);
  } else if (digits.startsWith("0")) {
    local = digits.slice(1);
  }

  const padded = local.slice(0, 9);

  if (padded.length !== 9) {
    return `+255 ${padded}`.trim();
  }

  return `+255 ${padded.slice(0, 3)} ${padded.slice(3, 6)} ${padded.slice(6, 9)}`;
}
