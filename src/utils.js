import moment from 'moment';
import {useLayoutEffect, useState} from "react";

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

export function useWindowSize() {
	const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

	useLayoutEffect(() => {
		function updateSize() {
			setIsMobile(window.innerWidth < 1024);
		}
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	return isMobile;
}

