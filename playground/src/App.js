import React, {useState} from 'react';
import {DateRangePickerTW, SingleDatePicker, SingleDatePickerTW} from 'date-picker';

function App() {
	const [date, setDate] = useState('2022-11-20 12:45')

  return (
		<div>
			{/*<SingleDatePicker*/}
			{/*	selection*/}
			{/*	onChange={(startDate, endDate) => {*/}
			{/*		console.log(startDate, endDate);*/}
			{/*		setDate(startDate)*/}
			{/*	}}*/}
			{/*	onClear={() => setDate(null)}*/}
			{/*	date={date}*/}
			{/*	// onlyInput*/}
			{/*	clearable*/}
			{/*	// asInput*/}
			{/*	// label='some date'*/}
			{/*	// useTimepicker*/}
			{/*/>*/}

			<SingleDatePickerTW
				selection
				onChange={(startDate, endDate) => {
					console.log(startDate, endDate);
					setDate(startDate)
				}}
				onClear={() => setDate(null)}
				date={date}
				// onlyInput
				clearable
				// asInput
				// label='some date'
				useTimepicker
			/>

			<DateRangePickerTW
				// asInput
				// clearable
				// selection
				// disabled
				// label
				// onChange={}
				// onClear={() => setDate(null)}
				// defaultStartDate
				// defaultEndDate
				// startDate
				// endDate
			/>

		</div>

	);
}

export default App;
