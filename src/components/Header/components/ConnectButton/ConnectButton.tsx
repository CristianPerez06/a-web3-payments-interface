import { useConnect } from 'wagmi';
import { useChainUtilities } from '@/library/hooks';
import { Button } from '@/library/components';

const ConnectButton = () => {
  const { isChainSupported } = useChainUtilities();
  const { connectors, connect } = useConnect();

  console.log(connectors);

  return (
    <Button
      onClick={() => {
        connect({ connector: connectors[0] });
      }}
      isDisabled={!isChainSupported}
    >
      Connect
    </Button>
  );
};

export default ConnectButton;
