import { http, createConfig } from 'wagmi';
import { mainnet, linea, lineaSepolia, sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

const config = createConfig({
  ssr: false,
  chains: [mainnet, linea, lineaSepolia, sepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [linea.id]: http(),
    [lineaSepolia.id]: http(),
    [sepolia.id]: http(),
  },
});

export default config;
