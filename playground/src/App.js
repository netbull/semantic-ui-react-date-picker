import React, {useState} from 'react';
import {TimePicker, TimePickerTW} from 'date-picker';

function App() {
	// const [startDate, setStartDate] = useState('2022-11-20')
	// const [endDate, setEndDate] = useState('2022-11-25')
	const [time, setTime] = useState('10:40')

  return (
		<div className='tw-flex tw-w-screen tw-justify-center tw-gap-2 tw-items-center tw-p-5'>

			<TimePicker
				value={time}
				onChange={value => setTime(value)}
				onClear={() => setTime('10:40')}
				// clearable
				onlyInput
			/>

			<TimePickerTW
				// clearable
				value={time}
				onChange={value => setTime(value)}
				onClear={() => setTime('10:40')}
				onlyInput
			/>

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

			{/*<SingleDatePickerTW*/}
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
			{/*	useTimepicker*/}
			{/*/>*/}

			{/*<DateRangePicker*/}
			{/*	// asInput*/}
			{/*	// clearable*/}
			{/*	selection*/}
			{/*	// disabled*/}
			{/*	// label*/}
			{/*	onChange={(start, end) => {*/}
			{/*		setStartDate(start);*/}
			{/*		setEndDate(end);*/}
			{/*	}}*/}
			{/*	// onClear={() => setDate(null)}*/}
			{/*	// defaultStartDate*/}
			{/*	// defaultEndDate*/}
			{/*	startDate={startDate || null}*/}
			{/*	endDate={endDate || null}*/}
			{/*/>*/}

			{/*<DateRangePickerTW*/}
			{/*	// asInput*/}
			{/*	// clearable*/}
			{/*	selection*/}
			{/*	// disabled*/}
			{/*	// label*/}
			{/*	onChange={(start, end) => {*/}
			{/*		setStartDate(start);*/}
			{/*		setEndDate(end);*/}
			{/*	}}*/}
			{/*	// onClear={() => setDate(null)}*/}
			{/*	// defaultStartDate*/}
			{/*	// defaultEndDate*/}
			{/*	startDate={startDate || null}*/}
			{/*	endDate={endDate || null}*/}
			{/*/>*/}

		</div>

	);
}

export default App;
