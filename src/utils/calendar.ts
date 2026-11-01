export function createGoogleCalendarUrl(
  title: string,
  targetDate?: Date | null,
  location?: string | null,
  details?: string | null
): string {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams();
  params.append("text", title);
  if (location) params.append("location", location);
  if (details) params.append("details", details);

  if (targetDate) {
    const start = new Date(targetDate);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const formatTime = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    params.append("dates", `${formatTime(start)}/${formatTime(end)}`);
  }

  return `${base}&${params.toString()}`;
}
