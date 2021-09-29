import React, { useEffect, useMemo, useRef } from 'react';
import { List as UIList, Ref } from 'semantic-ui-react';

import { buildTable } from './utils';
import { MODE } from '../constants';

const listStyles = {
  margin: 0,
  maxHeight: 250,
  overflowY: 'auto',
};

function List({ mode, timePairs, minutesDivider, disabled, value, onSelect }) {
  const listRef = useRef();
  const deps = [timePairs];
  if (mode === MODE.minutes) {
    deps.push(minutesDivider);
  }
  let items = useMemo(() => buildTable(mode, timePairs, minutesDivider), deps);

  useEffect(() => {
    scrollToItem(value, false);
  }, [value]);

  function scrollToItem(value, smooth = true) {
    const selectedItem = document.getElementById(`date-picker-time-${mode}-${value}`);
    if (listRef.current && selectedItem) {
      listRef.current.scrollTo({
        top: selectedItem.offsetTop,
        behavior: smooth ? 'smooth' : undefined
      });
    }
  }

  return (
    <Ref innerRef={listRef}>
      <UIList
        selection
        verticalAlign="middle"
        style={listStyles}>
        {items.map(item => (
          <UIList.Item
            key={`date-picker-time-${mode}-${item.label}`}
            id={`date-picker-time-${mode}-${item.label}`}
            disabled={disabled}
            onMouseDown={e => {
              e.preventDefault();
            }}
            onClick={() => {
              scrollToItem(item.value);
              onSelect(item.value);
            }}
            active={value && item.label === value}
            style={item.style}>
            {item.label}
          </UIList.Item>
        ))}
      </UIList>
    </Ref>
  );
}

export default List;
