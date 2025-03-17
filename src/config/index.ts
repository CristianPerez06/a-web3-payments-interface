import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY;

const config = createConfig({
  ssr: false,
  chains: [mainnet, sepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
    // [linea.id]: http(`https://linea-mainnet.g.alchemy.com/v2/${alchemyApiKey}`),
    // [lineaSepolia.id]: http(`https://linea-sepolia.g.alchemy.com/v2/${alchemyApiKey}`),
  },
});

export default config;
