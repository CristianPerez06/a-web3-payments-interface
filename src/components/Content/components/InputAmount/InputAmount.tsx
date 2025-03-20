import CurrencyInput from 'react-currency-input-field';

import styles from './InputAmount.module.scss';

export interface InputAmountProps {
  onChange: (value: number | null) => void;
}

type Comp = (props: InputAmountProps) => React.ReactNode;

const InputAmount: Comp = (props: InputAmountProps) => {
  const { onChange } = props;

  return (
    <div className={styles['container']}>
      <CurrencyInput
        name="amount"
        placeholder="0.00"
        decimalsLimit={2}
        allowNegativeValue={false}
        onValueChange={(value) => {
          // Value is empty
          if (!value) {
            onChange(null);
            return;
          }

          // Value is a number
          onChange(Number(value));
        }}
        className={styles['input']}
      />
    </div>
  );
};

export default InputAmount;
