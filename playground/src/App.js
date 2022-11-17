import React, {useState} from 'react';
import {SingleDatePicker, SingleDatePickerTW} from 'date-picker';

function App() {
	const [date, setDate] = useState(null)
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
				asInput
				label='some date'
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
				asInput
				label='some date'
			/>
		</div>

	);
}

export default App;
