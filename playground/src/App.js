import React from 'react';
import {SingleDatePicker, SingleDatePickerTW} from 'date-picker';

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
				// asInput
			/>

			<SingleDatePickerTW
				selection
				onChange={(startDate, endDate) => {
					console.log(startDate, endDate);
				}}
				onClear={() => {

				}}
				// asInput
			/>
		</div>

	);
}

export default App;
