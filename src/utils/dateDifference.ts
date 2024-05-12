export function dateDifferenceInSeconds(dateInitial: Date, dateFinal: Date) {
  return Math.round((dateFinal.getTime() - dateInitial.getTime()) / 1000);
}

export function formatSecondsInDateDifference(timeSeconds: number): String {
  if (!timeSeconds) return '00:00';

  const minutes = Math.floor(timeSeconds / 60);
  const seconds = timeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}