import cn from 'classnames';
import { useAccount } from 'wagmi';
import {
  EnsName,
  ChainSelector,
  BalanceSelector,
  ConnectButton,
  DisconnectButton,
} from '@/components/Header/components';

import styles from './Header.module.scss';

interface HeaderProps {
  onSymbolSelected: (symbol: string) => void;
}

type Comp = (props: HeaderProps) => React.ReactNode;

const Header: Comp = (props) => {
  const { onSymbolSelected } = props;

  const { address, chain } = useAccount();

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
            <>
              <ChainSelector chain={chain} />
              <BalanceSelector
                chainId={chain.id}
                connectedWalletAddress={address}
                onSymbolSelected={onSymbolSelected}
              />
            </>
          )}
        </div>
        <div className={styles['right-content']}>
          {isConnected && <EnsName address={address} />}
          {/* Connect button */}
          {!isConnected && <ConnectButton />}
          {/* Disconnect button */}
          {isConnected && <DisconnectButton />}
        </div>
      </div>
    </header>
  );
};

export default Header;
