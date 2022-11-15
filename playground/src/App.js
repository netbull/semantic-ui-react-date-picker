import React from 'react';
import {SingleDatePicker}  from 'date-picker';

function App() {
  return (
		<SingleDatePicker
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
