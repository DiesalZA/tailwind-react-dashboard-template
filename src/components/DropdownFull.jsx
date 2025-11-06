/**
 * DropdownFull Component
 *
 * A full-width dropdown for selecting from a list of options
 */

import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';

export default function DropdownFull({ options = [], selected, setSelected }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // Get the selected option label
  const selectedOption = options.find((opt) => opt.id === selected);
  const selectedLabel = selectedOption?.period || 'Select...';

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleSelect = (id) => {
    setSelected(id);
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={trigger}
        className="btn w-full justify-between min-w-44 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="flex items-center">
          <span>{selectedLabel}</span>
        </span>
        <svg
          className="shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500"
          width="11"
          height="7"
          viewBox="0 0 11 7"
        >
          <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
        </svg>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className="z-10 absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1"
        enter="transition ease-out duration-100 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          className="font-medium text-sm text-gray-600 dark:text-gray-300 max-h-60 overflow-y-auto"
        >
          {options.map((option) => (
            <button
              key={option.id}
              className={`flex items-center w-full hover:bg-gray-50 dark:hover:bg-gray-700/20 py-2 px-3 cursor-pointer ${
                option.id === selected ? 'text-violet-500' : ''
              }`}
              onClick={() => handleSelect(option.id)}
            >
              <svg
                className={`shrink-0 mr-2 fill-current ${
                  option.id === selected ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500 invisible'
                }`}
                width="12"
                height="9"
                viewBox="0 0 12 9"
              >
                <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
              </svg>
              <span>{option.period}</span>
            </button>
          ))}
        </div>
      </Transition>
    </div>
  );
}
