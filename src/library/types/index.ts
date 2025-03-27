import { Address } from 'abitype';

export enum ChainSymbol {
  ETH = 'ETH',
  LINK = 'LINK',
  USDT = 'USDT',
  USDC = 'USDC',
}

export type Erc20ContractsByChain = {
  [chainId: number]: {
    chainName: string;
    contracts: {
      [key in ChainSymbol]: Address | undefined;
    };
  };
};

export type ChainSymbolIds = {
  readonly [key in ChainSymbol]: number;
};
