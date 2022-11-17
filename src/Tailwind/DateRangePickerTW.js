import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import { DayPickerRangeController, DateRangePickerShape } from 'react-dates';
import { Popup, Grid, Menu, Button } from 'semantic-ui-react';
import omit from 'lodash/omit';

import { formatDate } from '../utils';
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

function DateRangePickerTW({ allowSingleDay, futureRanges, asInput, selection, clearable, disabled, label, placeholder, onChange, onClear, defaultStartDate, defaultEndDate, startDate, endDate, options, outputFormat, valueFormat, triggerSize, triggerStyle }) {
  const [open, toggleOpen] = useState(false); // TODO: remove after implementing headless
  const [dates, setDates] = useState({ startDate: formatDate(startDate ?? defaultStartDate, valueFormat), endDate: formatDate(endDate ?? defaultEndDate, valueFormat) });
  const [tempDates, setTempDates] = useState({ startDate: formatDate(startDate ?? defaultStartDate, valueFormat), endDate: formatDate(endDate ?? defaultEndDate, valueFormat) });
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
    toggleOpen(false);
    if (typeof defaultStartDate !== 'undefined' && !startDate && typeof defaultEndDate !== 'undefined' && !endDate) {
			setDates({
				startDate,
				endDate,
			});
		}
    onChange(startDate.format(valueFormat), endDate.format(valueFormat));
  }
  function handleClear() {
    toggleOpen(false);
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

  function rangeMenu() {
    const ranges = getRanges(allowSingleDay, futureRanges);
    return (
      <Menu secondary vertical fluid style={{ margin: 0, textAlign: 'center' }}>
        {Object.keys(ranges).map(range => {
          const isActive = activeRange === range;
          return (
            <Menu.Item
              key={`range-${range}`}
              name={range}
              active={isActive}
              onClick={() => {
                if (!isActive) {
                  setActiveRange(range);
                  handleChange(ranges[range][0], ranges[range][1]);
                }
              }}
            />
          );
        })}
        <Menu.Item
          name="Custom"
          active={activeRange === "Custom"}
          onClick={() => setActiveRange('Custom')}
        />
      </Menu>
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
		onDatesChange: dates => setTempDates(dates),
		focusedInput: focusedInput,
		onFocusChange: newFocusedInput => setFocusedInput(newFocusedInput || 'startDate'),
	};

  return (
    <>
      <Popup
				style={{ padding: 0 }}
        position="bottom center"
        flowing
				disabled={disabled}
        popperDependencies={[activeRange]}
        trigger={(
          <TriggerTW
            selection={selection}
            asInput={asInput}
            clearable={clearable}
						disabled={disabled}
            dates={dates}
            label={label}
						placeholder={placeholder}
            onClear={handleClear}
						outputFormat={outputFormat}
						size={triggerSize}
						style={triggerStyle}
          />
        )}
        on="click"
        size="mini"
        open={open}
        onOpen={() => toggleOpen(true)}
        onClose={() => {
          toggleOpen(false);
          if (isCustomRange && focusedInput === 'endDate') {
            setTempDates({
              ...dates,
            });
          }
        }}>
        <Popup.Content style={{ width: 'auto' }}>
          {!isCustomRange ? rangeMenu() : (
            <Grid centered divided style={{ margin: 0 }}>
              <Grid.Row>
                <Grid.Column textAlign="center" tablet="16" computer={isCustomRange ? 3 : 12}>
                  {rangeMenu()}
                </Grid.Column>
                {isCustomRange && (
                  <Grid.Column textAlign="center" tablet="16" computer="13">
                    <DayPickerRangeController {...pickerOptions} />

                    <Button
                      primary
                      floated="right"
                      size="mini"
                      content="Apply"
                      disabled={!tempDates.startDate || !tempDates.endDate}
                      onClick={() => {
                        handleChange(tempDates.startDate, tempDates.endDate);
                      }}
                    />
                    {clearable && (tempDates.startDate || tempDates.endDate) && (
                      <Button
                        primary
                        basic
                        floated="right"
                        size="mini"
                        color="red"
                        content="Cancel"
                        onClick={() => {
                          setTempDates({
                            ...dates,
                          });
                          toggleOpen(false);
                        }}
                      />
                    )}
                    <div style={{
                      float: 'right',
                      marginRight: 10,
                      fontSize: '1.2em',
                      verticalAlign: 'middle',
                      padding: '6px 0',
                      fontWeight: 'bold',
                    }}>
                      {tempDatesPlaceholder}
                    </div>
                  </Grid.Column>
                )}
              </Grid.Row>
            </Grid>
          )}
        </Popup.Content>
      </Popup>
    </>
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
	triggerSize: PropTypes.oneOf(['mini', 'tiny', 'small', 'large', 'big', 'huge', 'massive']),
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
	triggerSize: null,
	triggerStyle: {},
};

export default DateRangePickerTW;
