import cn from 'classnames';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import wagmiConfig from '@/config';
import { Button, Select } from '@/library/components';
import { useChainUtilities } from '@/library/hooks';
import { EnsName } from '@/components/Header/components';

import styles from './Header.module.scss';

export interface HeaderProps {
  onConnect: () => void;
}

type Comp = (props: HeaderProps) => React.ReactNode;

const Header: Comp = (props) => {
  const { onConnect } = props;

  const { isChainSupported } = useChainUtilities();
  const { address, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const handleChainChange = (chainId: string) => {
    switchChain({ chainId: parseInt(chainId) });
  };

  const isConnected = !!address;
  const chainSupported = !!chain;

  return (
    <header className={styles['container']}>
      <div className={styles['content']}>
        <div className={cn(styles['left-content'], !chainSupported && styles['disabled'])}>
          {/* Unsupported network */}
          {isConnected && !chainSupported && <div>{'Unsupported network'}</div>}
          {/* Supported network */}
          {isConnected && chainSupported && (
            <Select
              defaultValue={chain.id.toString()}
              options={wagmiConfig.chains.map((chain) => {
                return {
                  value: chain.id.toString(),
                  label: chain.name,
                };
              })}
              onChange={handleChainChange}
            />
          )}
        </div>
        <div className={styles['right-content']}>
          {isConnected && <EnsName address={address} />}
          {/* Connect button */}
          {!isConnected && (
            <Button
              onClick={() => {
                connect({ connector: connectors[0] });
                onConnect();
              }}
              isDisabled={!isChainSupported}
            >
              Connect
            </Button>
          )}
          {/* Disconnect button */}
          {isConnected && <Button onClick={() => disconnect()}>Disconnect</Button>}
        </div>
      </div>
    </header>
  );
};

export default Header;
