import { ChainSymbol } from '@/library/types';
import { Well } from '@/library/components';
import { TransferEth, TransferToken } from '@/components/Content/components';

import styles from './Content.module.scss';

interface ContentProps {
  symbolSelected: ChainSymbol;
}

type Comp = (props: ContentProps) => React.ReactNode;

const Content: Comp = (props) => {
  const { symbolSelected } = props;

  return (
    <div className={styles['container']}>
      <Well>
        {symbolSelected === ChainSymbol.ETH && <TransferEth currentSymbol={symbolSelected} />}
        {symbolSelected !== ChainSymbol.ETH && <TransferToken currentSymbol={symbolSelected} />}
      </Well>
    </div>
  );
};

export default Content;
