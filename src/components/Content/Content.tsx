import { ChainSymbol } from '@/library/types';
import { Chain } from 'wagmi/chains';
import { Well } from '@/library/components';
import { TransferEth, TransferToken } from '@/components/Content/components';

import styles from './Content.module.scss';

interface ContentProps {
  chainSelected: Chain;
  symbolSelected: ChainSymbol;
}

type Comp = (props: ContentProps) => React.ReactNode;

const Content: Comp = (props) => {
  const { chainSelected, symbolSelected } = props;

  return (
    <div className={styles['container']} key={chainSelected.id}>
      <Well>
        {symbolSelected === ChainSymbol.ETH && <TransferEth currentSymbol={symbolSelected} />}
        {symbolSelected !== ChainSymbol.ETH && <TransferToken currentSymbol={symbolSelected} />}
      </Well>
    </div>
  );
};

export default Content;
