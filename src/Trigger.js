import React from 'react';
import cx from 'classnames';
import * as PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import moment from 'moment';

function Trigger({ dates, date, selection, asInput, onlyInput, clearable, disabled, required, onClear, label, placeholder, outputFormat, size, style, ...rest }) {
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
		<div className={cx(`ui input ${size}`, { icon: clearable })}>
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
				<Icon
					name="times"
					className="link"
					onClick={() => onClear()}
				/>
			)}
		</div>
	);

	if (asInput) {
		return onlyInput ? input : (
			<div className={`ui field${required ? ' required' : ''}`} style={style}>
				{label && <label>{label}</label>}
				{input}
			</div>
		);
	}

	let appliedSize = '';
	if (size) {
		appliedSize = size;
	}
	return (
		<div className={cx(`ui dropdown ${appliedSize}`, { selection })} style={style} {...rest}>
			<Icon name="calendar" />
			<span>{printLabel}</span>
			{clearable && !isEmpty ? (
				<Icon
					name="times"
					style={{
						cursor: 'pointer',
						position: 'absolute',
						width: 'auto',
						height: 'auto',
						top: '.78571429em',
						right: '1em',
						zIndex: 3,
						margin: '-.78571429em',
						padding: '.91666667em',
						opacity: .8,
						WebkitTransition: 'opacity .1s ease',
						transition: 'opacity .1s ease',
					}}
					onClick={e => {
						e.stopPropagation();
						onClear();
					}}
				/>
			) : <Icon name="dropdown" />}
		</div>
	);
}

Trigger.propTypes = {
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
	size: PropTypes.oneOf(['mini', 'small', 'big']),
	style: PropTypes.object,
};

Trigger.defaultProps = {
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
	size: null,
	style: {},
};

export default Trigger;
