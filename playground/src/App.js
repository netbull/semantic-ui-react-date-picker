import React from 'react';
import {SingleDatePicker, SingleDatePickerTW, TestDiv} from 'date-picker';

function App() {
  return (
		<div style={{marginLeft: '80px'}}>
			<SingleDatePicker
				selection
				onChange={(startDate, endDate) => {
					console.log(startDate, endDate);
				}}
				onClear={() => {

				}}
			/>

			<SingleDatePickerTW
				selection
				onChange={(startDate, endDate) => {
					console.log(startDate, endDate);
				}}
				onClear={() => {

				}}
			/>

			<TestDiv />
		</div>

	);
}

export default App;
