import { Address } from 'abitype';
import { useEnsName } from 'wagmi';

import styles from './EnsName.module.scss';

export interface EnsNameProps {
  address: Address;
}

type Comp = (props: EnsNameProps) => React.ReactNode;

const EnsName: Comp = (props) => {
  const { address } = props;

  const { data, isLoading, error } = useEnsName({
    address: address,
    chainId: 1,
  });

  const showAddress = isLoading || error || !data;
  const showEnsName = data && !isLoading && !error;

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className={styles['container']}>
      {/* By default, show the address */}
      <span className={styles['text']}>{showAddress && formatAddress(address.toString())}</span>
      {/* If the ens name is loaded, show the ens name */}
      <span className={styles['text']}>{showEnsName && data}</span>
    </div>
  );
};

export default EnsName;
