import React, { useRef, useEffect, useState } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import cx from 'classnames';

import { MODE } from '../constants';
import List from './List';
const today = new Date();

function ScrollTimePicker({ clearable, disabled, size, label, placeholder, value, onChange, onClear, noMargin, onlyInput, minutesDivider, ...rest }) {
  const contextRef = useRef();
  const inputRef = useRef();
  const [open, togglePopup] = useState(false);
  const [mode, setMode] = useState(MODE.hours);

  useEffect(() => {
    if (mode === MODE.hours && open) {
      inputRef.current.blur();
    }
  }, [mode]);

  function handleSelect(value) {
    setMode(mode === MODE.hours ? MODE.minutes : MODE.hours);
    onChange(value);
  }

  const date = today;
  let timeParts = [null, null];
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
        context={contextRef}
        className="calendar"
        open={open}
        popperDependencies={[mode]}
        content={(
          <div style={{ display: 'flex' }}>
            <List
              mode={MODE.hours}
              timePairs={timeParts}
              disabled={disabled}
              value={timeParts[0]}
              onSelect={handleSelect}
            />
            <List
              mode={MODE.minutes}
              timePairs={timeParts}
              minutesDivider={minutesDivider}
              disabled={disabled}
              value={timeParts[1]}
              onSelect={handleSelect}
            />
          </div>
        )}
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

ScrollTimePicker.propTypes = {
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  noMargin: PropTypes.bool,
  onlyInput: PropTypes.bool,
  minutesDivider: PropTypes.number,
  label: PropTypes.string,
  size: PropTypes.oneOf(['mini']),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
};

ScrollTimePicker.defaultProps = {
  clearable: false,
  disabled: false,
  noMargin: true,
  onlyInput: false,
  minutesDivider: 5,
  size: null,
  label: null,
  placeholder: 'Select a time',
  onChange: () => {},
  onClear: () => {},
};

export default ScrollTimePicker;
