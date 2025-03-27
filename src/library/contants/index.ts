import { Erc20ContractsByChain, ChainSymbol, ChainSymbolIds } from '@/library/types';

export const erc20ContractsByChain: Erc20ContractsByChain = {
  [1]: {
    chainName: 'Mainnet',
    contracts: {
      [ChainSymbol.ETH]: undefined,
      [ChainSymbol.LINK]: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      [ChainSymbol.USDT]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      [ChainSymbol.USDC]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },
  },
  [11155111]: {
    chainName: 'Sepolia',
    contracts: {
      [ChainSymbol.ETH]: undefined,
      [ChainSymbol.LINK]: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
      [ChainSymbol.USDT]: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
      [ChainSymbol.USDC]: '0xAA020ae80d4ddCBb293978946e9862E15068EA99',
    },
  },
};

export const chainSymbolDecimals: ChainSymbolIds = {
  [ChainSymbol.ETH]: 18,
  [ChainSymbol.LINK]: 18,
  [ChainSymbol.USDT]: 6,
  [ChainSymbol.USDC]: 6,
};

export const GenericNullAddress = '0x0000000000000000000000000000000000000000';
