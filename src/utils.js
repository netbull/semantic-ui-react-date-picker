import moment from 'moment';

export function formatDate(date, format = null) {
  if (!date) {
    return null;
  }

  if (date instanceof moment) {
    return date;
  }

  let output = null;
  try {
    output = moment(date, format);
  } catch (e) {}

  return output;
}
