import React, { useRef, useEffect, useState } from 'react';
import { Icon, Popup, Table } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import cx from 'classnames';

import { MODE } from './constants';
import { formatTime } from './ScrollTimePicker/utils';
const today = new Date();

function buildTable(mode, date, timeParts, callback, disabled) {
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
			rowColumns.push((
				<Table.Cell
					disabled={disabled}
					onMouseDown={e => {
						e.preventDefault()
					}}
					onClick={() => {
						callback(cellText);
					}}
					key={`calendar-time-row-${r}-cell-${c}`}
					className={cx('link', { active: timeParts && timeParts[isHours ? 0 : 1] === currentParts[isHours ? 0 : 1]})}>
					{cellText}
				</Table.Cell>
			));
		}
		tableRows.push(<Table.Row key={`calendar-time-row-${r}`}>{rowColumns}</Table.Row>);
	}

	return (
		<Table
			celled
			unstackable
			textAlign="center"
			className={mode.replace('s', '')}>
			<Table.Body>
				{tableRows}
			</Table.Body>
		</Table>
	);
}

function TimePicker({ clearable, disabled, size, label, placeholder, value, onChange, onClear, noMargin, onlyInput, popupOpen, ...rest }) {
	const contextRef = useRef();
	const inputRef = useRef();
	const [open, togglePopup] = useState(false);
	const [mode, setMode] = useState(MODE.hours);

	useEffect(() => {
		if (mode === MODE.hours && open) {
			inputRef.current.blur();
		}
	}, [mode, popupOpen]);

	useEffect(() => {
		if (popupOpen) {
			inputRef.current.focus();
		} else {
			inputRef.current.blur();
		}
	}, [popupOpen]);

	function handleClick(value) {
		setMode(mode === MODE.hours ? MODE.minutes : MODE.hours);
		onChange(value);
	}

	const date = today;
	let timeParts = null;
	if (value && value.length === 5) {
		timeParts = value.split(':');
		date.setHours(timeParts[0]);
		date.setMinutes(timeParts[1]);
	}

	const input = (
		<div
			ref={contextRef}
			className={cx('ui input', { icon: clearable, [size]: size })}>
			<input
				ref={inputRef}
				readOnly
				type="text"
				{...rest}
				value={value ?? ''}
				placeholder={placeholder}
				disabled={disabled}
				onBlur={() => {
					setMode(MODE.hours);
					togglePopup(false);
				}}
				onFocus={() => togglePopup(true)}
				onChange={() => {}}
			/>
			{clearable && value && (
				<Icon
					name="times"
					className="link"
					onClick={() => onClear()}
				/>
			)}
		</div>
	);

	return (
		<>
			<Popup
				style={{ padding: 0 }}
				context={contextRef}
				className="calendar"
				open={open}
				popperDependencies={[mode]}
				content={buildTable(mode, date, timeParts, handleClick, disabled)}
			/>
			{onlyInput ? input : (
				<div className="ui field" style={{ margin: noMargin ? 0 : undefined }}>
					{label && <label>{label}</label>}
					{input}
				</div>
			)}
		</>
	)
}

TimePicker.propTypes = {
	clearable: PropTypes.bool,
	disabled: PropTypes.bool,
	noMargin: PropTypes.bool,
	onlyInput: PropTypes.bool,
	label: PropTypes.string,
	size: PropTypes.oneOf(['mini']),
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	onClear: PropTypes.func,
	popupOpen: PropTypes.bool,
};

TimePicker.defaultProps = {
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

export default TimePicker;
