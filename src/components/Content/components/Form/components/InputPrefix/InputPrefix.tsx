import React from 'react';

import styles from './InputPrefix.module.scss';

export interface InputPrefixProps {
  symbol: string;
}

type Comp = (props: InputPrefixProps) => React.ReactNode;

const InputPrefix: Comp = (props: InputPrefixProps) => {
  const { symbol } = props;

  return (
    <div className={styles['container']}>
      <div className={styles['content']}>
        <span className={styles['suffix']}>{symbol}</span>
      </div>
    </div>
  );
};

export default InputPrefix;
