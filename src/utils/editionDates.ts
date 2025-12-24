export type EditionDatesInput = {
  startDate?: string | null;
  endDate?: string | null;
};

function parseIsoDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isSameUtcDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function isFullUtcYearRange(start: Date, end: Date) {
  const y = start.getUTCFullYear();
  return (
    y === end.getUTCFullYear() &&
    start.getUTCMonth() === 0 &&
    start.getUTCDate() === 1 &&
    end.getUTCMonth() === 11 &&
    end.getUTCDate() === 31
  );
}

function lastDayOfUtcMonth(year: number, monthIndex0: number) {
  // day 0 of next month = last day of current month
  return new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
}

function isFullUtcMonthRange(start: Date, end: Date) {
  return (
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth() &&
    start.getUTCDate() === 1 &&
    end.getUTCDate() === lastDayOfUtcMonth(end.getUTCFullYear(), end.getUTCMonth())
  );
}

function fmt(locale: string, date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...options }).format(date);
}

export function formatEditionDateRange(
  input: EditionDatesInput,
  locale: "fr-FR" | "en-US",
): string | null {
  const start = parseIsoDate(input.startDate);
  if (!start) return null;
  const end = parseIsoDate(input.endDate) ?? start;

  // "2023"
  if (isFullUtcYearRange(start, end)) {
    return String(start.getUTCFullYear());
  }

  // "avril 2024" / "April 2024"
  if (isFullUtcMonthRange(start, end)) {
    return fmt(locale, start, { month: "long", year: "numeric" });
  }

  // Single day
  if (isSameUtcDay(start, end)) {
    return fmt(locale, start, { day: "numeric", month: "long", year: "numeric" });
  }

  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();

  if (locale === "fr-FR") {
    if (sameMonth) {
      const monthYear = fmt(locale, start, { month: "long", year: "numeric" });
      return `${start.getUTCDate()}–${end.getUTCDate()} ${monthYear}`;
    }
    if (sameYear) {
      const startPart = `${start.getUTCDate()} ${fmt(locale, start, { month: "short" })}`.trim();
      const endPart = `${end.getUTCDate()} ${fmt(locale, end, { month: "short" })}`.trim();
      return `${startPart} – ${endPart} ${start.getUTCFullYear()}`;
    }
    const startPart = fmt(locale, start, { day: "numeric", month: "short", year: "numeric" });
    const endPart = fmt(locale, end, { day: "numeric", month: "short", year: "numeric" });
    return `${startPart} – ${endPart}`;
  }

  // en-US
  if (sameMonth) {
    const month = fmt(locale, start, { month: "long" });
    const year = start.getUTCFullYear();
    return `${month} ${start.getUTCDate()}–${end.getUTCDate()}, ${year}`;
  }
  if (sameYear) {
    const startPart = fmt(locale, start, { month: "long", day: "numeric" });
    const endPart = fmt(locale, end, { month: "long", day: "numeric" });
    return `${startPart} – ${endPart}, ${start.getUTCFullYear()}`;
  }
  const startPart = fmt(locale, start, { month: "long", day: "numeric", year: "numeric" });
  const endPart = fmt(locale, end, { month: "long", day: "numeric", year: "numeric" });
  return `${startPart} – ${endPart}`;
}

export function formatEditionSentence(
  year: number,
  input: EditionDatesInput,
  locale: "fr-FR" | "en-US",
): string {
  const start = parseIsoDate(input.startDate);
  const end = parseIsoDate(input.endDate) ?? start;

  if (locale === "fr-FR") {
    if (!start || !end || isFullUtcYearRange(start, end)) {
      return `L'édition ${year} de l'ATC`;
    }

    if (isFullUtcMonthRange(start, end)) {
      const monthYear = fmt(locale, start, { month: "long", year: "numeric" });
      return `L'édition ${year} de l'ATC s'est déroulée en ${monthYear}`;
    }

    if (isSameUtcDay(start, end)) {
      const day = fmt(locale, start, { day: "numeric", month: "long", year: "numeric" });
      return `L'édition ${year} de l'ATC s'est déroulée le ${day}`;
    }

    const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
    const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();

    if (sameMonth) {
      const monthYear = fmt(locale, start, { month: "long", year: "numeric" });
      return `L'édition ${year} de l'ATC s'est déroulée du ${start.getUTCDate()} au ${end.getUTCDate()} ${monthYear}`;
    }

    if (sameYear) {
      const startPart = `${start.getUTCDate()} ${fmt(locale, start, { month: "long" })}`;
      const endPart = `${end.getUTCDate()} ${fmt(locale, end, { month: "long" })}`;
      return `L'édition ${year} de l'ATC s'est déroulée du ${startPart} au ${endPart} ${start.getUTCFullYear()}`;
    }

    const startPart = fmt(locale, start, { day: "numeric", month: "long", year: "numeric" });
    const endPart = fmt(locale, end, { day: "numeric", month: "long", year: "numeric" });
    return `L'édition ${year} de l'ATC s'est déroulée du ${startPart} au ${endPart}`;
  }

  // en-US
  if (!start || !end || isFullUtcYearRange(start, end)) {
    return `The ${year} ATC edition`;
  }

  if (isFullUtcMonthRange(start, end)) {
    const monthYear = fmt(locale, start, { month: "long", year: "numeric" });
    return `The ${year} ATC edition took place in ${monthYear}`;
  }

  if (isSameUtcDay(start, end)) {
    const day = fmt(locale, start, { month: "long", day: "numeric", year: "numeric" });
    return `The ${year} ATC edition took place on ${day}`;
  }

  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();

  if (sameMonth) {
    const month = fmt(locale, start, { month: "long" });
    const y = start.getUTCFullYear();
    return `The ${year} ATC edition took place on ${month} ${start.getUTCDate()}–${end.getUTCDate()}, ${y}`;
  }

  if (sameYear) {
    const startPart = fmt(locale, start, { month: "long", day: "numeric" });
    const endPart = fmt(locale, end, { month: "long", day: "numeric" });
    return `The ${year} ATC edition took place on ${startPart} – ${endPart}, ${start.getUTCFullYear()}`;
  }

  const startPart = fmt(locale, start, { month: "long", day: "numeric", year: "numeric" });
  const endPart = fmt(locale, end, { month: "long", day: "numeric", year: "numeric" });
  return `The ${year} ATC edition took place on ${startPart} – ${endPart}`;
}


