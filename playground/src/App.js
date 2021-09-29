import React from 'react';
import { DateRangePicker } from 'date-picker';

function App() {
  return (
		<DateRangePicker
			selection
			onChange={(startDate, endDate) => {
				console.log(startDate, endDate);
			}}
			onClear={() => {

			}}
		/>
	);
}

export default App;
