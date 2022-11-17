import React, {useState} from 'react';
import {DateRangePickerTW, SingleDatePickerTW} from 'date-picker';

function App() {
	const [date, setDate] = useState('2022-11-20 12:45')

  return (
		<div>
			<SingleDatePickerTW
				selection
				onChange={(startDate, endDate) => {
					console.log(startDate, endDate);
					setDate(startDate)
				}}
				onClear={() => setDate(null)}
				date={date}
				// onlyInput
				// clearable
				// asInput
				// label='some date'
				useTimepicker
			/>

			{/*<DateRangePickerTW />*/}

		</div>

	);
}

export default App;
