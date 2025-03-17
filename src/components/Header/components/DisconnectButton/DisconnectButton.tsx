import { useDisconnect } from 'wagmi';
import { useChainUtilities } from '@/library/hooks';
import { Button } from '@/library/components';

const ConnectButton = () => {
  const { isChainSupported } = useChainUtilities();
  const { disconnect } = useDisconnect();

  return (
    <Button
      onClick={() => {
        disconnect();
      }}
      isDisabled={!isChainSupported}
    >
      Disconnect
    </Button>
  );
};

export default ConnectButton;
