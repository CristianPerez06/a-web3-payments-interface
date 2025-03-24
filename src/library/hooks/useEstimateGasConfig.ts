import { parseUnits, Address } from 'viem';
import { erc20Abi, encodeFunctionData } from 'viem';
import { useAccount, UseEstimateGasParameters } from 'wagmi';
import { chainSymbolDecimals, erc20ContractsByChain } from '@/library/contants';
import { ChainSymbol } from '@/library/types';

const useEstimateGasConfig = () => {
  const { chainId } = useAccount();

  const getConfig = (currentSymbol: ChainSymbol, recipientAddress?: string, recipientAmount?: string) => {
    const contractAddress = erc20ContractsByChain[chainId!].contracts[currentSymbol];

    const decimalsLimit = chainSymbolDecimals[currentSymbol];

    let encodedData: Address | undefined;

    if (!!recipientAddress && !!recipientAmount) {
      encodedData = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipientAddress as Address, parseUnits(recipientAmount?.toString() ?? '0', decimalsLimit)],
      });
    }

    const config: UseEstimateGasParameters = {
      // chainId: chainId,
      to: contractAddress as Address,
      data: encodedData,
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

export default useEstimateGasConfig;
