import React, {useState, useEffect, Fragment} from 'react';
import * as PropTypes from 'prop-types';
import {DayPickerSingleDateController, SingleDatePickerShape} from 'react-dates';
import { Popover, Transition } from '@headlessui/react'
import moment from 'moment';
import omit from 'lodash/omit';

import { DATE_FORMAT_NORMAL, DATE_FORMAT, TIME_FORMAT, MODE } from '../constants';
import { formatDate } from '../utils';
import TriggerTW from "../Tailwind/TriggerTW";

function SingleDatePickerTW({ asInput, onlyInput, selection, clearable, disabled, required, syncValue, label, placeholder, onChange, onClear, date, minDate, options, outputFormat, valueFormat, triggerStyle, useTimepicker, ...rest }) {
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

	function handleDateChange(newDate, close) {
		if (!useTimepicker) {
			toggleOpen(false);
		}

		if (stateDate) {
			newDate.hours(stateDate.hours()).minutes(stateDate.minutes());
		}

		// If the date is before the minDate just assign the minDate
		// this is in order to adjust the time picker
		if (minDate && useTimepicker && newDate.isBefore(minDate)) {
			newDate = minDate;
		}

		if (syncValue) {
			setStateDate(newDate);
		}
		onChange(newDate.format(valueFormat));
		close()
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
		// onDateChange: date => handleDateChange(date),
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
			<div className="tw-relative tw-w-full tw-max-w-sm tw-px-5">
				<Popover className="tw-relative">
					{({ open:isOpen }) => (
						<>
							<Popover.Button
								className={`${isOpen ? '' : 'tw-text-opacity-90'}
                tw-group tw-inline-flex tw-items-center tw-rounded-md tw-px-4 tw-py-2 tw-text-base
                tw-font-medium tw-text-white hover:tw-text-opacity-100 focus:tw-outline-none
                focus-visible:tw-ring-1 focus-visible:tw-ring-white focus-visible:tw-ring-opacity-75`}
							>
								<TriggerTW
									isOpen={isOpen}
									onlyInput={onlyInput}
									selection={selection}
									asInput={asInput}
									clearable={clearable}
									disabled={disabled}
									required={required}
									date={stateDate}
									label={label}
									placeholder={placeholder}
									onClear={handleClear}
									outputFormat={outputFormat}
									style={triggerStyle}
									{...rest}
								/>
							</Popover.Button>
							<Transition
								as={Fragment}
								enter="tw-transition tw-ease-out tw-duration-200"
								enterFrom="tw-opacity-0 tw-translate-y-1"
								enterTo="tw-opacity-100 tw-translate-y-0"
								leave="tw-transition tw-ease-in tw-duration-150"
								leaveFrom="tw-opacity-100 tw-translate-y-0"
								leaveTo="tw-opacity-0 tw-translate-y-1"
							>
								<Popover.Panel
									className="tw-absolute tw-left-1/2 tw-z-10 tw-mt-3 tw-w-screen tw-max-w-sm tw--translate-x-1/2 tw-transform tw-px-4 tw-px-2">
									{({close}) => (
										<div className="tw-overflow-hidden tw-rounded-lg tw-shadow-md tw-ring-1 tw-ring-black tw-ring-opacity-5">
											<DayPickerSingleDateController {...pickerOptions } onDateChange={(date) => handleDateChange(date, close)} />
										</div>
									)}
								</Popover.Panel>
							</Transition>
						</>
					)}
				</Popover>
			</div>
		</>
	);
}

SingleDatePickerTW.propTypes = {
	asInput: PropTypes.bool,
	onlyInput: PropTypes.bool,
	selection: PropTypes.bool,
	clearable: PropTypes.bool,
	disabled: PropTypes.bool,
	required: PropTypes.bool,
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
	triggerStyle: PropTypes.object,
	useTimepicker: PropTypes.bool,
};

SingleDatePickerTW.defaultProps = {
	asInput: false,
	onlyInput: false,
	selection: false,
	clearable: false,
	disabled: false,
	required: false,
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
	triggerStyle: {},
	useTimepicker: false,
};

export default SingleDatePickerTW;
