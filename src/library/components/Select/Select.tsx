import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';

import styles from './Select.module.scss';

export type Option = {
  value: string;
  label: string;
};

enum Positions {
  TOP = 'top',
  BOTTOM = 'BOTTOM',
}

const EMPTY_OPTION = { value: '', label: '' };

type SelectProps = {
  options: Option[];
  defaultValue?: string;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
};

type Comp = (props: SelectProps) => React.ReactNode;

export const Select: Comp = (props: SelectProps) => {
  const { options, defaultValue = '', isDisabled = false, onChange } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState(defaultValue);
  const [selectedOption, setSelectedOption] = useState<Option>(EMPTY_OPTION);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultValue) {
      const opt = options.find((o) => o.value === defaultValue) || EMPTY_OPTION;
      setText(opt.label);
      setSelectedOption(opt);
    }
  }, [defaultValue, options]);

  useEffect(() => {
    if (!isOpen) {
      // Refresh text value with selected one in case the user has changed it but didn't select a new one
      setText(selectedOption.label);
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, selectedOption]);

  const handleOptionClick = useCallback(
    (option: Option) => {
      setText(option.label);
      setSelectedOption(option);
      setIsOpen(false);

      if (onChange) onChange(option.value);
    },
    [onChange],
  );

  return (
    <div ref={wrapperRef} className={styles['wrapper']}>
      <button
        className={cn(styles['container'], isDisabled && styles['disabled'])}
        onClick={() => {
          if (isDisabled) return;
          setIsOpen((prev) => !prev);
        }}
      >
        <div className={styles['text-container']}>
          <span className={styles['text']}>{text}</span>
        </div>
        <div className={styles['chevron-container']}>
          <ChevronDownIcon className={cn(styles['chevron'], isOpen && styles['rotate'])} />
        </div>
      </button>
      {isOpen && (
        <div className={cn(styles['outer-wrapper'], styles[Positions.BOTTOM])}>
          <div className={styles['inner-wrapper']}>
            <ul className={styles['options']}>
              {options.length === 0 ? (
                <li className={styles['no-options']} onClick={() => setIsOpen(false)}>
                  No options
                </li>
              ) : (
                <>
                  {options.map((option) => (
                    <li
                      key={option.value}
                      className={cn(styles['option'], selectedOption.value === option.value && styles['is-selected'])}
                      onClick={() => handleOptionClick(option)}
                    >
                      <div className={styles['option-text-container']}>
                        <span className={styles['option-text']}>{option.label}</span>
                      </div>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
