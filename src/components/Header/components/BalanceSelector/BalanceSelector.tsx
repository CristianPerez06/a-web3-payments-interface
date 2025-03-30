import { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Address } from 'abitype';
import { Button, Select } from '@/library/components';
import { useGetBalances } from '@/library/hooks';
import { erc20ContractsByChain } from '@/library/contants';
import { ChainSymbol } from '@/library/types';

import styles from './BalanceSelector.module.scss';

export interface BalanceSelectorProps {
  chainId: number;
  connectedWalletAddress: Address;
  onSymbolSelected: (symbol: ChainSymbol) => void;
}

type Comp = (props: BalanceSelectorProps) => React.ReactNode;

const BalanceSelector: Comp = (props) => {
  const { chainId, connectedWalletAddress, onSymbolSelected } = props;

  const [selectedSymbol, setSelectedSymbol] = useState<string>('');

  const currentChainData = erc20ContractsByChain[chainId];
  const currentChainTokenAddresses = Object.values(currentChainData!.contracts).map((address) => {
    return address;
  }) as Address[];

  const { data, isLoading, refetch } = useGetBalances(connectedWalletAddress, currentChainTokenAddresses!);

  const handleSymbolSelected = useCallback(
    (option: string) => {
      const symbol = option as ChainSymbol;

      setSelectedSymbol(symbol);
      onSymbolSelected(symbol);
    },
    [onSymbolSelected],
  );

  const handleRefreshClick = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data.length > 0) {
      handleSymbolSelected(data[0].symbol as ChainSymbol);
    }
  }, [data, handleSymbolSelected]);

  const isDisabled = isLoading || data.length === 0;

  return (
    <div className={styles['container']}>
      {isDisabled && <Select defaultValue={'-'} options={[{ value: '-', label: '---' }]} isDisabled />}
      {!isDisabled && (
        <Select
          defaultValue={selectedSymbol}
          options={data.map((balance) => ({
            value: balance.symbol,
            label: `${Number(balance.balance).toFixed(2)} - ${balance.symbol}`,
          }))}
          onChange={handleSymbolSelected}
        />
      )}
      <Button
        onClick={handleRefreshClick}
        variant="secondary"
        containerClass={cn(styles['button-custom-container'], isDisabled && styles['disabled'])}
        isDisabled={isDisabled}
      >
        <ArrowPathIcon className={styles['button-icon']} />
      </Button>
    </div>
  );
};

export default BalanceSelector;
