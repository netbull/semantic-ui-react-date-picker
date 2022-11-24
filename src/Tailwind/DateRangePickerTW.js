import React, {useState, useEffect, Fragment} from 'react';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import {DateRangePickerShape, DayPickerRangeController} from 'react-dates';
import { Popover, Transition } from '@headlessui/react'

import omit from 'lodash/omit';

import {formatDate, useWindowSize} from '../utils';
import { DATE_FORMAT, DATE_FORMAT_NORMAL } from '../constants';
import TriggerTW from '../Tailwind/TriggerTW';

function getRanges(allowSingleDay = false, futureRanges = false) {
  const singleDay = {
    Today: [moment(), moment()],
  };

  let ranges;
  if (futureRanges) {
  	singleDay.Tommorow = [moment().add(1, 'days'), moment().add(1, 'days')];
		ranges = {
			'Next 3 days': [moment(), moment().add(2, 'days')],
			'Next 7 days': [moment(), moment().add(6, 'days')],
			'Next 30 days': [moment(), moment().add(29, 'days')],
			'This month': [moment().startOf('month'), moment().endOf('month')],
			'Next month': [
				moment().add(1, 'month').startOf('month'),
				moment().add(1, 'month').endOf('month'),
			],
		};
	} else {
		singleDay.Yesterday = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
		ranges = {
			'Last 3 days': [moment().subtract(2, 'days'), moment()],
			'Last 7 days': [moment().subtract(6, 'days'), moment()],
			'Last 30 days': [moment().subtract(29, 'days'), moment()],
			'This month': [moment().startOf('month'), moment().endOf('month')],
			'Last month': [
				moment().subtract(1, 'month').startOf('month'),
				moment().subtract(1, 'month').endOf('month'),
			],
		};
	}

  if (allowSingleDay) {
    return {
      ...singleDay,
      ...ranges,
    };
  }

  return ranges;
}

function findActiveRange(allowSingleDay, futureRanges, startDate, endDate, format) {
  if (!startDate || !endDate) {
    return null;
  }

  const ranges = getRanges(allowSingleDay, futureRanges);
  const rangesKeys = Object.keys(ranges);

  let match = 'Custom';
  for (let i = 0; i < rangesKeys.length; i++) {
    const range = rangesKeys[i];
    const rangeStartDate = ranges[range][0].format(format);
    const rangeEndDate = ranges[range][1].format(format);

    if (startDate === rangeStartDate && endDate === rangeEndDate) {
      match = range;
      break;
    }
  }

  return match;
}

function DateRangePickerTW({ allowSingleDay, futureRanges, asInput, selection, clearable, disabled, label, placeholder, onChange, onClear, defaultStartDate, defaultEndDate, startDate, endDate, options, outputFormat, valueFormat, triggerStyle}) {
	const isMobile = useWindowSize()

	const [dates, setDates] = useState(
		{ startDate: formatDate(startDate ?? defaultStartDate, valueFormat),
			endDate: formatDate(endDate ?? defaultEndDate, valueFormat) }
	);
  const [tempDates, setTempDates] = useState(
		{ startDate: formatDate(startDate ?? defaultStartDate, valueFormat),
			endDate: formatDate(endDate ?? defaultEndDate, valueFormat) }
	);
  const [focusedInput, setFocusedInput] = useState('startDate');
  const [activeRange, setActiveRange] = useState(findActiveRange(allowSingleDay, futureRanges, startDate, endDate, valueFormat));

  const isCustomRange = activeRange === 'Custom';
  useEffect(() => {
  	setDates({
			startDate: formatDate(startDate, valueFormat),
			endDate: formatDate(endDate, valueFormat),
		});
	}, [startDate, endDate]);

	function handleChange(startDate, endDate) {
		if (typeof defaultStartDate !== 'undefined' && !startDate && typeof defaultEndDate !== 'undefined' && !endDate) {
			setDates({
				startDate,
				endDate,
			});
		}
		onChange(startDate.format(valueFormat), endDate.format(valueFormat));
	}

  function handleClear() {
		if (typeof defaultStartDate !== 'undefined' && !startDate && typeof defaultEndDate !== 'undefined' && !endDate) {
			setDates({
				startDate: null,
				endDate: null,
			});
			setTempDates({
				startDate: null,
				endDate: null,
			});
		}
    onClear();
  }

	const RangeMenu = ({close, standalone = false}) => {
		const ranges = getRanges(allowSingleDay, futureRanges);
		return (
			<ul
				className={`tw-flex tw-text-md tw-font-medium tw-text-gray-800 tw-bg-white tw-border-gray-200 tw-p-3
				${standalone ? 'tw-border tw-rounded tw-flex-col tw-w-40' : 'tw-w-full lg:tw-w-40 lg:tw-flex-wrap tw-border-b tw-flex-row lg:tw-flex-col lg:tw-border-r tw-flex-wrap'}`}
			>
				{Object.keys(ranges).map(range => {
					const isActive = activeRange === range;
					return (
						<li
							className={`tw-flex tw-justify-center tw-rounded-lg tw-py-1 tw-m-1 tw-px-2 ${isActive ? 'tw-bg-slate-300' : 'tw-bg-slate-50 tw-cursor-pointer hover:tw-bg-slate-200'}`}
							key={`range-${range}`}
							onClick={() => {
								if (!isActive) {
									close()
									setActiveRange(range);
									handleChange(ranges[range][0], ranges[range][1]);
								}
							}}
						>
							{range}
						</li>
					);
				})}
				<li
					className={`tw-flex tw-justify-center tw-rounded-lg tw-py-1 tw-m-1 tw-px-2 ${activeRange === 'Custom' ? 'tw-bg-slate-300' : 'tw-bg-slate-50 tw-cursor-pointer hover:tw-bg-slate-200'}`}
					onClick={() => {
						if (activeRange !== 'Custom') {
							setActiveRange('Custom')
						}
					}}
				>
					Custom
				</li>
			</ul>
		);
	}

  let tempDatesPlaceholder = null;
  if ((!clearable && tempDates.startDate && tempDates.endDate) || (clearable && tempDates.startDate)) {
    const startDate = tempDates.startDate.format(outputFormat);
    const endDate = tempDates.endDate ? tempDates.endDate.format(outputFormat) : null;
		tempDatesPlaceholder = startDate !== endDate && endDate ? `${startDate} - ${endDate}` : startDate;
  }

	const pickerOptions = {
		noBorder: true,
		hideKeyboardShortcutsPanel: true,
		numberOfMonths: 2,
		minimumNights: allowSingleDay ? 0 : 1,
		firstDayOfWeek: 1,
		...options,
		startDate: tempDates.startDate,
		endDate: tempDates.endDate,
		focusedInput: focusedInput,
		onFocusChange: newFocusedInput => setFocusedInput(newFocusedInput || 'startDate'),
	};

  return (
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
							selection={selection}
							asInput={asInput}
							clearable={clearable}
							disabled={disabled}
							dates={dates}
							label={label}
							placeholder={placeholder}
							onClear={handleClear}
							outputFormat={outputFormat}
							style={triggerStyle}
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
							className="tw-absolute tw-left-1/2 tw-z-10 tw-mt-3 tw-w-fit tw--translate-x-1/2 tw-transform tw-px-4 tw-px-2"
						>
							{({close}) => {
								return !isCustomRange
									? <RangeMenu close={close} standalone />
									: (
										<div className="tw-flex tw-flex-col lg:tw-flex-row tw-overflow-auto tw-w-full tw-rounded-lg tw-shadow-md tw-ring-1 tw-ring-black tw-ring-opacity-5">
											<RangeMenu close={close} />
											<div className='tw-flex tw-flex-col'>
												<DayPickerRangeController
													{...pickerOptions }
													numberOfMonths={isMobile ? 1 : 2}
													onDatesChange={(dates) => {setTempDates(dates)}}
												/>
												<div className='tw-flex tw-gap-2 tw-items-center tw-p-3 tw-justify-end'>
													<div className='tw-font-medium'>
														{tempDatesPlaceholder}
													</div>
													<button
														type='button'
														className='tw-bg-blue-400 tw-border tw-rounded tw-shadow-sm tw-text-white tw-font-semibold tw-px-3 tw-py-2'
														disabled={!tempDates.startDate || !tempDates.endDate}
														onClick={() => {
															close()
															handleChange(tempDates.startDate, tempDates.endDate);
														}}
													>
														Apply
													</button>
													{clearable && (tempDates.startDate || tempDates.endDate) && (
														<button
															type='button'
															className='tw-bg-red-400 tw-border tw-shadow-sm tw-rounded tw-text-gray-800 tw-font-semibold tw-px-3 tw-py-2'
															onClick={() => {
																close();
																setTempDates({
																	...dates,
																});
															}}
														>
															Cancel
														</button>
													)}
												</div>
											</div>
										</div>
									)
							}}
						</Popover.Panel>
					</Transition>
				</>
			)}
			</Popover>
		</div>
  );
}

DateRangePickerTW.propTypes = {
  allowSingleDay: PropTypes.bool,
  futureRanges: PropTypes.bool,
  asInput: PropTypes.bool,
  selection: PropTypes.bool,
  clearable: PropTypes.bool,
	disabled: PropTypes.bool,
  label: PropTypes.string,
	placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  options: PropTypes.shape(omit(DateRangePickerShape, ['onDatesChange', 'onFocusChange', 'startDateId', 'endDateId'])),
	outputFormat: PropTypes.string,
	valueFormat: PropTypes.string,
	triggerStyle: PropTypes.object,
};

DateRangePickerTW.defaultProps = {
  allowSingleDay: true,
  futureRanges: false,
  asInput: false,
  selection: false,
  clearable: false,
	disabled: false,
  label: null,
  placeholder: 'All dates',
  onChange: () => {},
  onClear: () => {},
  startDate: null,
  endDate: null,
	options: {},
	outputFormat: DATE_FORMAT,
	valueFormat: DATE_FORMAT_NORMAL,
	triggerStyle: {},
};

export default DateRangePickerTW;
