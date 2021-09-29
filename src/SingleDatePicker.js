import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { DayPickerSingleDateController, SingleDatePickerShape } from 'react-dates';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';
import omit from 'lodash/omit';

import { DATE_FORMAT_NORMAL, DATE_FORMAT } from './constants';
import { formatDate } from './utils';
import Trigger from './Trigger';

function SingleDatePicker({ asInput, onlyInput, selection, clearable, disabled, syncValue, label, placeholder, onChange, onClear, date, options, outputFormat, valueFormat, triggerSize, triggerStyle, ...rest }) {
	const [open, toggleOpen] = useState(false);
	const [stateDate, setStateDate] = useState(formatDate(date, valueFormat));

	useEffect(() => {
		setStateDate(formatDate(date, valueFormat));
	}, [date]);

	function handleChange(newDate) {
		toggleOpen(false);
		if (syncValue) {
			setStateDate(newDate);
		}
		onChange(newDate.format(valueFormat));
	}
	function handleClear() {
		toggleOpen(false);
		if (syncValue) {
			setStateDate(null);
		}
		onClear();
	}

	const pickerOptions = {
		noBorder: true,
		hideKeyboardShortcutsPanel: true,
		firstDayOfWeek: 1,
		...options,
		date: stateDate,
		onDateChange: date => handleChange(date),
		focused: open,
		onFocusChange: ({ focused }) => toggleOpen(focused),
	};

	return (
		<>
			<Popup
				position="bottom center"
				flowing
				disabled={disabled}
				trigger={(
					<Trigger
						onlyInput={onlyInput}
						selection={selection}
						asInput={asInput}
						clearable={clearable}
						disabled={disabled}
						date={stateDate}
						label={label}
						placeholder={placeholder}
						onClear={handleClear}
						outputFormat={outputFormat}
						size={triggerSize}
						style={triggerStyle}
						{...rest}
					/>
				)}
				on="click"
				size="mini"
				open={open}
				onOpen={() => toggleOpen(true)}
				onClose={() => {
					toggleOpen(false);
				}}>
				<Popup.Content>
					<DayPickerSingleDateController {...pickerOptions} />
				</Popup.Content>
			</Popup>
		</>
	);
}

SingleDatePicker.propTypes = {
	asInput: PropTypes.bool,
	onlyInput: PropTypes.bool,
	selection: PropTypes.bool,
	clearable: PropTypes.bool,
	disabled: PropTypes.bool,
	syncValue: PropTypes.bool,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	onClear: PropTypes.func,
	date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(moment)]),
	options: PropTypes.shape(omit(SingleDatePickerShape, ['onDateChange', 'onFocusChange', 'id'])),
	outputFormat: PropTypes.string,
	valueFormat: PropTypes.string,
	triggerSize: PropTypes.oneOf(['mini', 'small', 'big']),
	triggerStyle: PropTypes.object,
};

SingleDatePicker.defaultProps = {
	asInput: false,
	onlyInput: false,
	selection: false,
	clearable: false,
	disabled: false,
	syncValue: false,
	label: null,
	placeholder: 'Select a date',
	onChange: () => {},
	onClear: () => {},
	date: null,
	options: {},
	outputFormat: DATE_FORMAT,
	valueFormat: DATE_FORMAT_NORMAL,
	triggerSize: null,
	triggerStyle: {},
};

export default SingleDatePicker;
