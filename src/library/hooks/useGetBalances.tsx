import { useState, useEffect, useCallback } from 'react';
import { getBalance } from '@wagmi/core';
import { Address } from 'abitype';
import { isEqual } from 'lodash';
import wagmiConfig from '@/config';
import { ChainSymbol } from '@/library/types';

interface BalancePerSymbol {
  symbol: ChainSymbol;
  balance: string;
}

const useGetBalances = (walletAddress: Address, tokenAddresses: Address[]) => {
  const [currentTokenAddresses, setCurrentTokenAddresses] = useState<Address[]>([]);
  const [data, setData] = useState<BalancePerSymbol[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = useCallback(async (walletAddress: Address, tokenAddress?: Address) => {
    const balance = await getBalance(wagmiConfig, {
      address: walletAddress,
      token: tokenAddress,
    });

    return {
      symbol: balance.symbol as ChainSymbol,
      balance: balance.formatted,
    };
  }, []);

  const getBalances = useCallback(async () => {
    setIsLoading(true);
    const balances: BalancePerSymbol[] = [];

    for (const tokenAddress of currentTokenAddresses) {
      try {
        const balance = await fetchBalance(walletAddress, tokenAddress);

        balances.push({
          symbol: balance.symbol,
          balance: balance.balance,
        });
      } catch (error) {
        console.error(error);
      }
    }

    const filteredBalances = balances.filter((balance) => balance !== null);

    setData(filteredBalances);
    setIsLoading(false);
  }, [currentTokenAddresses, fetchBalance, walletAddress]);

  useEffect(() => {
    if (tokenAddresses.length === 0) return;
    if (isEqual(tokenAddresses, currentTokenAddresses)) return;

    setCurrentTokenAddresses(tokenAddresses);
  }, [tokenAddresses, currentTokenAddresses]);

  useEffect(() => {
    getBalances();
  }, [currentTokenAddresses, getBalances]);

  return { data, isLoading, refetch: getBalances };
};

export default useGetBalances;
