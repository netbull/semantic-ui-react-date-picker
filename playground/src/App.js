import React, {useState} from 'react';
import {TimePicker, TimePickerTW, SingleDatePicker, SingleDatePickerTW, DateRangePicker, DateRangePickerTW} from 'date-picker';

function App() {
	const [startDate, setStartDate] = useState('2022-11-20')
	const [endDate, setEndDate] = useState('2022-11-25')
	const [date, setDate] = useState('2022-11-15')
	const [time, setTime] = useState('10:40')

  return (
		<div className='tw-flex tw-flex-col tw-w-screen tw-justify-center tw-gap-2 tw-items-center tw-p-5'>
			<div className='tw-flex tw-w-full tw-items-center tw-justify-center'>
				<TimePicker
					value={time}
					onChange={value => setTime(value)}
					onClear={() => setTime('10:40')}
				/>

				<TimePickerTW
					value={time}
					onChange={value => setTime(value)}
					onClear={() => setTime('10:40')}
				/>
			</div>

			<div className='tw-flex tw-w-full tw-items-center tw-justify-center'>
				<SingleDatePicker
					selection
					onChange={(startDate, endDate) => {
						setDate(startDate)
					}}
					onClear={() => setDate(null)}
					date={date}
					clearable
					useTimepicker
				/>

				<SingleDatePickerTW
					selection
					onChange={(startDate, endDate) => {
						setDate(startDate)
					}}
					onClear={() => setDate(null)}
					date={date}
					clearable
					useTimepicker
				/>
			</div>

			<div className='tw-flex tw-w-full tw-items-center tw-justify-center'>
				<DateRangePicker
					// asInput
					// clearable
					selection
					// disabled
					// label
					onChange={(start, end) => {
						setStartDate(start);
						setEndDate(end);
					}}
					// onClear={() => setDate(null)}
					// defaultStartDate
					// defaultEndDate
					startDate={startDate || null}
					endDate={endDate || null}
				/>

				<DateRangePickerTW
					// asInput
					// clearable
					selection
					// disabled
					// label
					onChange={(start, end) => {
						setStartDate(start);
						setEndDate(end);
					}}
					// onClear={() => setDate(null)}
					// defaultStartDate
					// defaultEndDate
					startDate={startDate || null}
					endDate={endDate || null}
				/>
			</div>
		</div>
	);
}

export default App;
