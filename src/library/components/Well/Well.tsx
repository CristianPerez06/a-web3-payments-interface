import cn from 'classnames';

import styles from './Well.module.scss';

export interface WellProps {
  children: React.ReactNode;
}

type Comp = (props: WellProps) => React.ReactNode;

const Well: Comp = (props) => {
  const { children } = props;

  return <div className={cn(styles['container'])}>{children}</div>;
};

export default Well;
