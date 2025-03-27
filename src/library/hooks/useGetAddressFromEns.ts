import { useState, useEffect, useCallback } from 'react';
import { normalize } from 'viem/ens';
import { getEnsAddress } from '@wagmi/core';
import { Address } from 'abitype';
import wagmiConfig from '@/config';
import { useTextUtilities } from '@/library/hooks';

const useGetAddressFromEns = (input: string | null) => {
  const [data, setData] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isEns, isAddress } = useTextUtilities();

  const getAddress = useCallback(
    async (input: string) => {
      setIsLoading(true);

      // Input is an ENS name
      if (isEns(input)) {
        const ensAddress = await getEnsAddress(wagmiConfig, {
          name: normalize(input),
        });
        setData(ensAddress);
        setIsLoading(false);
        return;
      }

      // Input is an address
      if (isAddress(input)) {
        setData(input as Address);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    },
    [isAddress, isEns],
  );

  useEffect(() => {
    if (!input) return;

    getAddress(input);
  }, [input, getAddress]);

  return { data, isLoading };
};

export default useGetAddressFromEns;
