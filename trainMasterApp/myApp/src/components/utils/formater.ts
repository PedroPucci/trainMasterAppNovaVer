export function secondsToReadableTime(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "0 min";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  return `${minutes} min`;
}