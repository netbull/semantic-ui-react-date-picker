import React, {useState, Fragment} from 'react';
import * as PropTypes from 'prop-types';
import {DayPickerSingleDateController, SingleDatePickerShape} from 'react-dates';
import { Popover, Transition, Listbox } from '@headlessui/react'
import moment from 'moment';
import omit from 'lodash/omit';
import range from 'lodash/range';

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
	const [stateDate, setStateDate] = useState(formatDate(date, valueFormat));

	function handleDateChange(newDate, close) {
		if (!useTimepicker) {
			close()
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
	}

	function handleTimeChange(mode, value, close = null) {
		if (mode === MODE.minutes) {
			close()
		}

		const newDate = stateDate[mode](parseInt(value, 10));
		if (syncValue) {
			setStateDate(newDate);
		}
		onChange(newDate.format(valueFormat));
	}

	function handleClear() {
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
	};

	if (minDate) {
		pickerOptions.isOutsideRange = day => {
			return day.hours(23).minutes(59).isBefore(minDate);
		};
	}

	let hourOptions = []
	let minuteOptions = []

	if (useTimepicker) {
		hourOptions = range(0, 24).map(hour => {
			let disabled = false
			if (minDate) {
				const tmp = stateDate.clone().hours(hour);
				disabled = tmp.isBefore(minDate)
			}

			hour = hour.toString().padStart(2, '0');
			return { key: hour, value: hour, text: hour, disabled }
		})

		minuteOptions = range(0, 12).map(repetition => {
			let minute = repetition * 5;
			let disabled = false
			if (minDate) {
				const tmp = stateDate.clone().hours(minute);
				disabled = tmp.isBefore(minDate)
			}

			minute = minute.toString().padStart(2, '0');
			return { key: minute, value: minute, text: minute, disabled }
		})
	}

	const hoursValue = stateDate.hours().toString().padStart(2, '0')
	const minutesValue = stateDate.minutes().toString().padStart(2, '0')

	const TimePicker = ({onClose, hoursValue, minutesValue }) => {
		return (
			<div className='tw-relative tw-flex tw-pb-3 tw-items-center tw-justify-center'>
				<Listbox
					value={hoursValue}
					onChange={(value) => {
						handleTimeChange(MODE.hours, value)
					}}
				>
					<div className="tw-relative tw-mt-1">
						<Listbox.Button
							className="tw-relative tw-w-full tw-cursor-default tw-rounded-lg tw-bg-white tw-py-2 tw-pl-3 tw-pr-10 tw-text-left tw-shadow-md
							focus:tw-outline-none focus-visible:tw-border-indigo-500 focus-visible:tw-ring-2 focus-visible:tw-ring-white
							focus-visible:tw-ring-opacity-75 focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-orange-300 lg:tw-text-sm"
						>
							<span className="tw-block tw-text-lg">{hoursValue}</span>
							<span className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
								{/*ChevronDown*/}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none" viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="tw-w-5 tw-h-5"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
								</svg>
            </span>
						</Listbox.Button>

						<Listbox.Options
							className="tw-fixed tw-mt-1 tw-max-h-48 tw-overflow-auto tw-rounded-md tw-bg-white tw-py-1
							tw-text-base tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none lg:tw-text-sm"
						>
						{hourOptions.map((hour) => (
							<Listbox.Option
								key={hour.key}
								value={hour.value}
								disabled={hour.disabled}
								className={({ active }) => `tw-relative tw-w-full tw-cursor-default tw-select-none tw-py-2 tw-pl-10 tw-pr-4
								${active ? 'tw-bg-amber-100 tw-text-amber-900' : 'tw-text-gray-900'}`}
							>
								{({ selected }) => (
									<>
										<span
											className={`tw-block tw-text-lg ${selected ? 'tw-font-semibold' : 'tw-font-normal'}`}
										>
											{hour.text}
										</span>
										{selected ? (
											<span className="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3 tw-text-amber-600">
												{/*Check Icon*/}
                      	<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth="1.5"
													stroke="currentColor"
													className="tw-w-5 tw-h-5"
												>
  												<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
												</svg>
											</span>
										) : null}
									</>
								)}
							</Listbox.Option>
						))}
					</Listbox.Options>
					</div>
				</Listbox>

				<span className='tw-mt-0 tw-mb-[5] tw-mx-3 tw-font-semibold tw-text-lg'>:</span>

				<Listbox
					value={minutesValue}
					onChange={(value) => {
						handleTimeChange(MODE.minutes, value, onClose)
					}}
				>
					<div className="tw-relative tw-mt-1">
						<Listbox.Button
							className="tw-relative tw-w-full tw-cursor-default tw-rounded-lg tw-bg-white tw-py-2 tw-pl-3 tw-pr-10 tw-text-left tw-shadow-md
							focus:tw-outline-none focus-visible:tw-border-indigo-500 focus-visible:tw-ring-2 focus-visible:tw-ring-white
							focus-visible:tw-ring-opacity-75 focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-orange-300 lg:tw-text-sm"
						>
							<span className="tw-block tw-text-lg">{minutesValue}</span>
							<span className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
								{/*ChevronDown*/}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none" viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="tw-w-5 tw-h-5"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
								</svg>
            </span>
						</Listbox.Button>

						<Listbox.Options
							className="tw-fixed tw-mt-1 tw-max-h-48 tw-overflow-auto tw-rounded-md tw-bg-white tw-py-1
							tw-text-base tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none lg:tw-text-sm"
						>
							{minuteOptions.map((minute) => (
								<Listbox.Option
									key={minute.key}
									value={minute.value}
									disabled={minute.disabled}
									className={({ active }) => `tw-relative tw-w-full tw-cursor-default tw-select-none tw-py-2 tw-pl-10 tw-pr-4
								${active ? 'tw-bg-amber-100 tw-text-amber-900' : 'tw-text-gray-900'}`}
								>
									{({ selected }) => (
										<>
										<span
											className={`tw-block tw-text-lg ${selected ? 'tw-font-semibold' : 'tw-font-normal'}`}
										>
											{minute.text}
										</span>
											{selected ? (
												<span className="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3 tw-text-amber-600">
												{/*Check Icon*/}
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth="1.5"
														stroke="currentColor"
														className="tw-w-5 tw-h-5"
													>
  												<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
												</svg>
											</span>
											) : null}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</div>
				</Listbox>
			</div>
		)
	}

	return (
		<>
			<div className="tw-relative tw-w-full tw-max-w-sm tw-px-5">
				<Popover className="tw-relative">
					{({ open: isOpen }) => (
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
										<div className="tw-overflow-hidden  tw-rounded-lg tw-shadow-md tw-ring-1 tw-ring-black tw-ring-opacity-5">
											<DayPickerSingleDateController {...pickerOptions } onDateChange={(date) => handleDateChange(date, close)} />

											{useTimepicker && <TimePicker onClose={close} hoursValue={hoursValue} minutesValue={minutesValue}/>}
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
