import cn from 'classnames';

import styles from './Button.module.scss';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  isDisabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  containerClass?: string;
}

type Comp = (props: ButtonProps) => React.ReactNode;

const Button: Comp = ({ children, onClick, isDisabled = false, type = 'button', containerClass }) => {
  return (
    <button className={cn(styles['container'], containerClass)} onClick={onClick} disabled={isDisabled} type={type}>
      {children}
    </button>
  );
};

export default Button;
