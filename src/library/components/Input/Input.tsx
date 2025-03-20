import { ChangeEvent } from 'react';

import cn from 'classnames';

import styles from './Input.module.scss';

export interface InputProps {
  name: string;
  value: string | number;
  placeholder?: string;
  isDisabled?: boolean;
  isAutocompleteEnabled?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  containerClass?: string;
  inputClass?: string;
}

type Comp = (props: InputProps) => React.ReactNode;

export const Input: Comp = (props: InputProps) => {
  const {
    name,
    value,
    placeholder,
    isDisabled = false,
    isAutocompleteEnabled = false,
    isSuccess,
    isError,
    onChange,
    containerClass,
    inputClass,
  } = props;

  return (
    <div className={cn(styles.container, containerClass)}>
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={isDisabled}
        className={cn(styles.input, inputClass, isSuccess && styles.success, isError && styles.error)}
        onChange={onChange}
        autoComplete={isAutocompleteEnabled ? 'on' : 'off'}
      />
    </div>
  );
};

export default Input;
