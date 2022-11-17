import React, {useState} from 'react';
import {SingleDatePicker, SingleDatePickerTW} from 'date-picker';

function App() {
	const [date, setDate] = useState('2022-11-20 12:45')

  return (
		<div style={{marginLeft: '80px'}}>
			<SingleDatePicker
				selection
				onChange={(startDate, endDate) => {
					console.log(startDate, endDate);
					setDate(startDate)
				}}
				onClear={() => setDate(null)}
				date={date}
				// clearable
				// onlyInput
				// asInput
				// label='some date'
				useTimepicker
			/>

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
		</div>

	);
}

export default App;
