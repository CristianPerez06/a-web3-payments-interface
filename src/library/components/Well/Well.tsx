import cn from 'classnames';

import styles from './Well.module.scss';

type Comp = () => React.ReactNode;

const Well: Comp = () => {
  return <div className={cn(styles['container'])}></div>;
};

export default Well;
