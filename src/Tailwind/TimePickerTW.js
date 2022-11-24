import React, {useState, Fragment} from 'react';
import * as PropTypes from 'prop-types';

import { MODE } from '../constants';
import { formatTime } from '../ScrollTimePicker/utils';
import {Popover, Transition} from "@headlessui/react";
const today = new Date();

function buildTable(mode, date, timeParts, callback, disabled, setIsShowing) {
	const isHours = mode === MODE.hours;
	const rows = isHours ? 6 : 4;
	const columns = isHours ? 4 : 3;

	const hour = date.getHours();
	let i = 0;
	const tableRows = [];
	for (let r = 0; r < rows; r++) {
		const rowColumns = [];
		for (let c = 0; c < columns; c++, i++) {
			const cellDate = isHours ?
				new Date(2021, 7, 28, i) :
				new Date(2021, 7, 28, hour, i * 5);

			const cellText = formatTime(cellDate);
			const currentParts = cellText.split(':');
			const isActive = timeParts && timeParts[isHours ? 0 : 1] === currentParts[isHours ? 0 : 1]
			rowColumns.push((
				<td
					onMouseDown={e => {
						e.preventDefault()
					}}
					onClick={() => {
						if (mode === MODE.minutes) {
							setIsShowing(false)
						}
						callback(cellText);
					}}
					key={`calendar-time-row-${r}-cell-${c}`}
					className={`hover:tw-bg-gray-200 tw-p-3 tw-border ${isActive ? 'tw-bg-gray-200' : ''}`}>
					{cellText}
				</td>
			));
		}
		tableRows.push(<tr className='tw-bg-white tw-cursor-pointer' key={`calendar-time-row-${r}`}>{rowColumns}</tr>);
	}

	return (
		<table
			className='tw-w-full tw-text-md tw-text-center tw-text-gray-700'>
			<tbody>
				{tableRows}
			</tbody>
		</table>
	);
}

function TimePickerTW({ clearable, disabled, label, placeholder, value, onChange, onClear, noMargin, onlyInput, popupOpen, ...rest }) {
	const [mode, setMode] = useState(MODE.hours);
	const [isShowing, setIsShowing] = useState(false)

	function handleClick(value) {
		onChange(value);
		setMode(mode === MODE.hours ? MODE.minutes : MODE.hours);
	}

	const date = today;
	let timeParts = null;
	if (value && value.length === 5) {
		timeParts = value.split(':');
		date.setHours(timeParts[0]);
		date.setMinutes(timeParts[1]);
	}

	const Input = () => (
		<div
			className='tw-flex tw-border tw-rounded tw-px-4 tw-py-3 tw-font-semibold tw-text-gray-900'>
			<input
				readOnly
				type="text"
				{...rest}
				value={value ?? ''}
				placeholder={placeholder}
				disabled={disabled}
				onChange={() => {}}
			/>
			{clearable && value && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className="tw-w-5 tw-h-5"
					onClick={() => onClear()}
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
				</svg>
			)}
		</div>
	);

	return (
		<Popover className="tw-relative">
				<>
					<Popover.Button
						onBlur={() => {
							setIsShowing(false)
							setMode(MODE.hours);
						}}
						onClick={() => {
							setIsShowing(!isShowing)
						}}
						className={`${isShowing ? '' : 'tw-text-opacity-90'}
							tw-group tw-inline-flex tw-items-center tw-rounded-md tw-px-4 tw-py-2 tw-text-base
							tw-font-medium tw-text-white hover:tw-text-opacity-100 focus:tw-outline-none
							focus-visible:tw-ring-1 focus-visible:tw-ring-white focus-visible:tw-ring-opacity-75`}
					>
						{onlyInput ? <Input /> : (
							<div>
								{label && <label>{label}</label>}
								<Input />
							</div>
						)}
					</Popover.Button>
					<Transition
						show={isShowing}
						as={Fragment}
						enter="tw-transition tw-ease-out tw-duration-200"
						enterFrom="tw-opacity-0 tw-translate-y-1"
						enterTo="tw-opacity-100 tw-translate-y-0"
						leave="tw-transition tw-ease-in tw-duration-50"
						leaveFrom="tw-opacity-100 tw-translate-y-0"
						leaveTo="tw-opacity-0 tw-translate-y-1"
					>
						<Popover.Panel
							className="tw-w-fit tw-max-w-sm tw-absolute tw-left-1/2 tw-z-10 tw-mt-1 tw--translate-x-1/2 tw-transform tw-px-2">
							{isShowing && (
								<div className="tw-overflow-hidden tw-rounded-lg tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5">
									{buildTable(mode, date, timeParts, handleClick, disabled, setIsShowing)}
								</div>
							)}
						</Popover.Panel>
					</Transition>
				</>
			</Popover>
	)
}

TimePickerTW.propTypes = {
	clearable: PropTypes.bool,
	disabled: PropTypes.bool,
	noMargin: PropTypes.bool,
	onlyInput: PropTypes.bool,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	onClear: PropTypes.func,
	popupOpen: PropTypes.bool,
};

TimePickerTW.defaultProps = {
	clearable: false,
	disabled: false,
	noMargin: true,
	onlyInput: false,
	size: null,
	label: null,
	placeholder: 'Select a time',
	onChange: () => {},
	onClear: () => {},
	popupOpen: false,
};

export default TimePickerTW;
