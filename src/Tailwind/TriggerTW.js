import React from 'react';
import * as PropTypes from 'prop-types';
import moment from 'moment';

function TriggerTW({ isOpen, dates, date, selection, asInput, onlyInput, clearable, disabled, required, onClear, label, placeholder, outputFormat, style, ...rest }) {
	let isEmpty = true;
	let printLabel = label ?? placeholder;

	if ((!clearable && dates.startDate && dates.endDate) || (clearable && dates.startDate)) {
		const startDate = dates.startDate.format(outputFormat);
		const endDate = dates.endDate ? dates.endDate.format(outputFormat) : null;
		printLabel = startDate !== endDate && endDate ? `${startDate} - ${endDate}` : startDate;
		isEmpty = false;
	}

	if (isEmpty && date) {
		printLabel = date.format(outputFormat);
		isEmpty = false;
	}

	const input = (
		<div className='tw-border tw-rounded tw-text-gray-500 tw-p-3'>
			<input
				type="text"
				{...rest}
				value={date ? date.format(outputFormat) : ''}
				placeholder={placeholder}
				disabled={disabled}
				required={required}
				onChange={() => {}}
			/>
			{clearable && !isEmpty && (
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

	if (asInput) {
		return onlyInput
			? input
			: (
				<div className={'tw-gap-2 tw-flex tw-items-center tw-text-gray-600'} style={style}>
					{label && <label>{label}</label>}
					{input}
				</div>
			);
	}

	return (
		<div
			className={`tw-flex tw-font-semibold tw-text-gray-900 tw-p-3 tw-items-center tw-gap-2 tw-rounded ${selection ? 'tw-border' : ''}`}
			style={style}
			{...rest}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none" viewBox="0 0 24 24"
				strokeWidth="1.5"
				stroke="currentColor"
				className="tw-w-5 tw-h-5"
			>
				<path strokeLinecap="round" strokeLinejoin="round"
							d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"/>
			</svg>
			<span>{printLabel}</span>
			{clearable && !isEmpty ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="tw-w-5 tw-h-5 "
						onClick={() => onClear()}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
					</svg>
			) :
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="currentColor"
					className="tw-w-5 tw-h-5"
				>
					{isOpen
						? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
						: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
					}
				</svg>
			}
		</div>
	);
}

TriggerTW.propTypes = {
	isOpen: PropTypes.bool,
	dates: PropTypes.shape({
		startDate: PropTypes.instanceOf(moment),
		endDate: PropTypes.instanceOf(moment),
	}),
	date: PropTypes.instanceOf(moment),
	selection: PropTypes.bool,
	asInput: PropTypes.bool,
	onlyInput: PropTypes.bool,
	clearable: PropTypes.bool,
	disabled: PropTypes.bool,
	required: PropTypes.bool,
	onClear: PropTypes.func,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	style: PropTypes.object,
};

TriggerTW.defaultProps = {
	isOpen: false,
	dates: {},
	date: null,
	selection: true,
	asInput: false,
	onlyInput: false,
	clearable: true,
	disabled: false,
	required: false,
	onClear: () => {},
	label: null,
	placeholder: null,
	style: {},
};

export default TriggerTW;
