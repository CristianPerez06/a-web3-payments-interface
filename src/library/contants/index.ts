import { Erc20ContractsByChain, ChainSymbols } from '@/library/types';

export const erc20ContractsByChain: Erc20ContractsByChain[] = [
  {
    chainName: 'Mainnet',
    chainId: 1,
    contracts: [
      { symbol: ChainSymbols.ETH },
      { symbol: ChainSymbols.LINK, address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' },
      { symbol: ChainSymbols.USDT, address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
      { symbol: ChainSymbols.USDC, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
    ],
  },
  {
    chainName: 'Sepolia',
    chainId: 11155111,
    contracts: [
      { symbol: ChainSymbols.ETH },
      { symbol: ChainSymbols.LINK, address: '0x779877A7B0D9E8603169DdbD7836e478b4624789' },
      { symbol: ChainSymbols.USDT, address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0' },
      { symbol: ChainSymbols.USDC, address: '0xAA020ae80d4ddCBb293978946e9862E15068EA99' },
    ],
  },
];
