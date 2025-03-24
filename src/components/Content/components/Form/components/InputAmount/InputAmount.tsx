import CurrencyInput from 'react-currency-input-field';
import { ChainSymbol } from '@/library/types';
import { chainSymbolDecimals } from '@/library/contants';

import styles from './InputAmount.module.scss';

export type InputAmountValue = string | readonly string[] | number | undefined;

export interface InputAmountProps {
  value: InputAmountValue;
  decimalsLimit?: number;
  onChange: (value: string | null) => void;
}

type Comp = (props: InputAmountProps) => React.ReactNode;

const InputAmount: Comp = (props: InputAmountProps) => {
  const { value, decimalsLimit = chainSymbolDecimals[ChainSymbol.ETH], onChange } = props;

  return (
    <div className={styles['container']}>
      <CurrencyInput
        name="amount"
        placeholder="0.00"
        value={value}
        decimalsLimit={decimalsLimit}
        allowNegativeValue={false}
        onValueChange={(value) => {
          // Value is empty
          if (!value) {
            onChange(null);
            return;
          }

          // Value is a number
          onChange(value);
        }}
        className={styles['input']}
      />
    </div>
  );
};

export default InputAmount;
