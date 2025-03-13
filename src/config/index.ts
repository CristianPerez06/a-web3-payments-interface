import { http, createConfig } from 'wagmi';
import { mainnet, linea, lineaSepolia, sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

const config = createConfig({
  ssr: false,
  chains: [mainnet, linea, lineaSepolia, sepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/XRH3SFJJlG7A9CqClZUkCNkiodc3lfkl'),
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/XRH3SFJJlG7A9CqClZUkCNkiodc3lfkl'),
    [linea.id]: http('https://linea-mainnet.g.alchemy.com/v2/XRH3SFJJlG7A9CqClZUkCNkiodc3lfkl'),
    [lineaSepolia.id]: http('https://linea-sepolia.g.alchemy.com/v2/XRH3SFJJlG7A9CqClZUkCNkiodc3lfkl'),
  },
});

export default config;
