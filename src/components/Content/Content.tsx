import cn from 'classnames';

import styles from './Content.module.scss';

export interface ContentProps {
  children: React.ReactNode;
}

type Comp = (props: ContentProps) => React.ReactNode;

const Content: Comp = (props) => {
  const { children } = props;
  return <div className={cn(styles['container'])}>{children}</div>;
};

export default Content;
