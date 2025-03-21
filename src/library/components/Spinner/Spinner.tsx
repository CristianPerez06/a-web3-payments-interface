import cn from 'classnames';
import styles from './Spinner.module.scss';

type Size = 'sm' | 'md' | 'lg';

type Comp = (props: { size?: Size }) => React.ReactNode;

const Spinner: Comp = ({ size = 'sm' }) => {
  return (
    <div className={styles['container']}>
      <div className={cn(styles['content'], styles[size])}></div>
    </div>
  );
};

export default Spinner;
