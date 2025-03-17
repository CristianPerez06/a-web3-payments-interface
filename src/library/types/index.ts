import { Address } from 'abitype';

export enum ChainSymbols {
  ETH = 'ETH',
  LINK = 'LINK',
  USDT = 'USDT',
  USDC = 'USDC',
}

export interface Erc20ContractsByChain {
  chainName: string;
  chainId: number;
  contracts: { symbol: ChainSymbols; address?: Address }[];
}
