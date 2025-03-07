import cn from 'classnames';

import styles from './Button.module.scss';

export interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isDisabled?: boolean;
}

type Comp = (props: ButtonProps) => React.ReactNode;

const Button: Comp = ({ children, onClick, isDisabled = false }) => {
  return (
    <button className={cn(styles['container'])} onClick={onClick} disabled={isDisabled}>
      {children}
    </button>
  );
};

export default Button;
