import cn from 'classnames';

import styles from './Well.module.scss';

export interface WellProps {}

type Comp = (props: WellProps) => React.ReactNode;

const Well: Comp = (props) => {
  return <div className={cn(styles['container'])}>This is the well</div>;
};

export default Well;
