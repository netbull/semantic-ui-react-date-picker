import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { DayPickerSingleDateController, SingleDatePickerShape } from 'react-dates';
import { Dropdown, Popup } from 'semantic-ui-react';
import moment from 'moment';
import omit from 'lodash/omit';
import range from 'lodash/range';

import { DATE_FORMAT_NORMAL, DATE_FORMAT, TIME_FORMAT, MODE } from './constants';
import { formatDate } from './utils';
import Trigger from './Trigger';

function SingleDatePicker({ asInput, onlyInput, selection, clearable, disabled, syncValue, label, placeholder, onChange, onClear, date, minDate, options, outputFormat, valueFormat, triggerSize, triggerStyle, useTimepicker, ...rest }) {
	if (useTimepicker && (valueFormat.indexOf('H') === -1 || valueFormat.indexOf('m') === -1)) {
		valueFormat = `${valueFormat} ${TIME_FORMAT}`;
	}
	if (useTimepicker && (outputFormat.indexOf('H') === -1 || outputFormat.indexOf('m') === -1)) {
		outputFormat = `${outputFormat} ${TIME_FORMAT}`;
	}
	minDate = formatDate(minDate, valueFormat);

	const [open, toggleOpen] = useState(false);
	const [stateDate, setStateDate] = useState(formatDate(date, valueFormat));

	useEffect(() => {
		setStateDate(formatDate(date, valueFormat));
	}, [date]);

	function handleDateChange(newDate) {
		if (!useTimepicker) {
			toggleOpen(false);
		}

		newDate.hours(stateDate.hours()).minutes(stateDate.minutes());
		// If the date is before the minDate just assign the minDate
		// this is in order to adjust the time picker
		if (minDate && useTimepicker && newDate.isBefore(minDate)) {
			newDate = minDate;
		}

		if (syncValue) {
			setStateDate(newDate);
		}
		onChange(newDate.format(valueFormat));
	}
	function handleTimeChange(mode, value) {
		if (mode === MODE.minutes) {
			toggleOpen(false);
		}

		const newDate = stateDate[mode](parseInt(value, 10));
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
		onDateChange: date => handleDateChange(date),
		focused: open,
		onFocusChange: ({ focused }) => {
			if (!useTimepicker || focused) {
				toggleOpen(focused);
			}
		},
	};

	if (minDate) {
		pickerOptions.isOutsideRange = day => {
			return day.hours(23).minutes(59).isBefore(minDate);
		};
	}

	return (
		<>
			<Popup
				style={{ padding: 0 }}
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

					{useTimepicker && (
						<div style={{ display: 'flex', paddingBottom: 15, alignItems: 'center', justifyContent: 'center' }}>
							<Dropdown
								selection
								scrolling
								options={range(0, 24).map(hour => {
									const tmp = stateDate.clone().hours(hour);
									hour = hour.toString().padStart(2, '0');
									return { key: hour, value: hour, text: hour, disabled: minDate ? tmp.isBefore(minDate) : false }
								})}
								selectOnBlur={false}
								style={{ minWidth: 'auto' }}
								value={stateDate.hours().toString().toString().padStart(2, '0')}
								onChange={(e, { value }) => handleTimeChange(MODE.hours, value)}
							/>
							<span style={{ margin: '0 5px', fontWeight: 'bold', fontSize: 18 }}>:</span>
							<Dropdown
								selection
								scrolling
								options={range(0, 12).map(repetition => {
									let minute = repetition * 5;
									const tmp = stateDate.clone().minutes(minute);
									minute = minute.toString().padStart(2, '0');
									return { key: minute, value: minute, text: minute, disabled: minDate ? tmp.isBefore(minDate) : false }
								})}
								selectOnBlur={false}
								style={{ minWidth: 'auto' }}
								value={stateDate.minutes().toString().toString().padStart(2, '0')}
								onChange={(e, { value }) => handleTimeChange(MODE.minutes, value)}
							/>
						</div>
					)}
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
	minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(moment)]),
	options: PropTypes.shape(omit(SingleDatePickerShape, ['onDateChange', 'onFocusChange', 'id'])),
	outputFormat: PropTypes.string,
	valueFormat: PropTypes.string,
	triggerSize: PropTypes.oneOf(['mini', 'small', 'big']),
	triggerStyle: PropTypes.object,
	useTimepicker: PropTypes.bool,
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
	minDate: null,
	options: {},
	outputFormat: DATE_FORMAT,
	valueFormat: DATE_FORMAT_NORMAL,
	triggerSize: null,
	triggerStyle: {},
	useTimepicker: false,
};

export default SingleDatePicker;
