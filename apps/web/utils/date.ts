import dayjs from 'dayjs';

export function formatDateFromNow(dateString: string) {
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
