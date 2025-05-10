import dayjs from 'dayjs';

export function formatDateFromNow(dateString: string | null) {
  if (!dateString) {
    return '';
  }

  try {
    return dayjs(dateString).fromNow();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return dateString;
  }
}

export function formatDate(
  dateString: string,
  format: string = 'YYYY-MM-DD HH:mm:ss'
) {
  try {
    return dayjs(dateString).format(format);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return dateString;
  }
}

export function formatTime(dateStr: string) {
  try {
    return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss.SSS');
  } catch (e) {
    return dateStr;
  }
}

export function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;

  const seconds = Math.floor(ms / 1000);
  const remainingMs = ms % 1000;

  if (seconds < 60) return `${seconds}.${remainingMs}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
