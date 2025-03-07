import { useState } from 'react';
import cn from 'classnames';
import styles from './Header.module.scss';
import { Button } from '@/library/components';

export interface HeaderProps {
  onConnect: () => void;
}

type Comp = (props: HeaderProps) => React.ReactNode;

const Header: Comp = (props) => {
  const { onConnect } = props;

  const [isConnected, setIsConnected] = useState(false);

  const handleConnectClick = () => {
    console.log('connect');
  };

  return (
    <header className={cn(styles['container'])}>
      <div className={cn(styles['content'])}>
        <Button onClick={handleConnectClick}>{isConnected ? 'Disconnect' : 'Connect'}</Button>
      </div>
    </header>
  );
};

export default Header;
