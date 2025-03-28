import { useChains, useChainId } from 'wagmi';

const useChainUtilities = () => {
  const chains = useChains();
  const chainId = useChainId();

  const isChainSupported = (): boolean => {
    const res = chains.some((chain) => chain.id === chainId);
    return res;
  };

  return {
    isChainSupported,
  };
};

export default useChainUtilities;
