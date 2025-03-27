import { useCallback, useEffect, useState } from 'react';
import { Address } from 'abitype';
import { Select } from '@/library/components';
import { useGetBalances } from '@/library/hooks';
import { erc20ContractsByChain } from '@/library/contants';
import { ChainSymbol } from '@/library/types';
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

  const { data, isLoading } = useGetBalances(connectedWalletAddress, currentChainTokenAddresses!);

  const handleSymbolSelected = useCallback(
    (option: string) => {
      const symbol = option as ChainSymbol;

      setSelectedSymbol(symbol);
      onSymbolSelected(symbol);
    },
    [onSymbolSelected],
  );

  useEffect(() => {
    if (data.length > 0) {
      handleSymbolSelected(data[0].symbol as ChainSymbol);
    }
  }, [data, handleSymbolSelected]);

  if (isLoading || data.length === 0) {
    return <Select defaultValue={'-'} options={[{ value: '-', label: '---' }]} isDisabled />;
  }

  return (
    <Select
      defaultValue={selectedSymbol}
      options={data.map((balance) => ({
        value: balance.symbol,
        label: `${Number(balance.balance).toFixed(2)} - ${balance.symbol}`,
      }))}
      onChange={handleSymbolSelected}
    />
  );
};

export default BalanceSelector;
