import { parseUnits, Address } from 'viem';
import { erc20Abi } from 'viem';
import { useAccount, UseSimulateContractParameters } from 'wagmi';
import { chainSymbolDecimals, erc20ContractsByChain } from '@/library/contants';
import { ChainSymbol } from '@/library/types';

const useSimulateContractConfig = () => {
  const { chainId } = useAccount();

  const getConfig = (currentSymbol: ChainSymbol, recipientAddress?: string, recipientAmount?: string) => {
    const decimalsLimit = chainSymbolDecimals[currentSymbol];

    const contractAddress = erc20ContractsByChain[chainId!].contracts[currentSymbol];

    const args =
      recipientAddress && recipientAmount
        ? [recipientAddress as Address, parseUnits(recipientAmount.toString(), decimalsLimit)]
        : [];

    const config: UseSimulateContractParameters = {
      address: contractAddress!,
      abi: erc20Abi,
      functionName: 'transfer',
      args: args,
      query: {
        enabled: !!recipientAmount && !!recipientAddress,
      },
    };

    return config;
  };

  return {
    getConfig,
  };
};

export default useSimulateContractConfig;
