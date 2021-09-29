import { MODE } from '../constants';

export function addLeadingZero(number) {
  if (number < 10) {
    return `0${number}`;
  }

  return number.toString();
}

export function formatTime(date) {
  return `${addLeadingZero(date.getHours())}:${addLeadingZero( date.getMinutes())}`;
}

export function buildTable(mode, timePairs = [null,null], minutesDivider = 5) {
  const isHours = mode === MODE.hours;
  let hours = timePairs[0];
  if (!hours) {
  	hours = 0;
	}
  let minutes = timePairs[1];
  if (!minutes) {
		minutes = 0;
	}
  const items = [];
  const itemsCount = isHours ? 24 : 60/minutesDivider;
  for (let i = 0; i < itemsCount; i++) {
    const date = isHours ?
      new Date(2021, 7, 28, i, minutes) :
      new Date(2021, 7, 28, hours, i * minutesDivider);

    const label = addLeadingZero(isHours ?  date.getHours() : date.getMinutes());
    items.push({
      style: { padding: '15px 25px' },
      value: formatTime(date),
      label,
    });
  }

  return items;
}
