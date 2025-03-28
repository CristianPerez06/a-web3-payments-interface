import wagmiConfig from '@/config';
import { useSwitchChain } from 'wagmi';
import { Chain } from 'wagmi/chains';
import { Select } from '@/library/components';

export interface ChainSelectorProps {
  chain: Chain;
  onChainSelected: (chain: Chain) => void;
}

type Comp = (props: ChainSelectorProps) => React.ReactNode;

const ChainSelector: Comp = (props) => {
  const { chain, onChainSelected } = props;

  const { switchChain, isPending } = useSwitchChain();

  return (
    <Select
      defaultValue={chain.id.toString()}
      options={wagmiConfig.chains.map((chain) => {
        return {
          value: chain.id.toString(),
          label: chain.name,
        };
      })}
      onChange={(chainId) => {
        switchChain({ chainId: parseInt(chainId) });
        onChainSelected(wagmiConfig.chains.find((chain) => chain.id.toString() === chainId) as Chain);
      }}
      isDisabled={isPending}
    />
  );
};

export default ChainSelector;
