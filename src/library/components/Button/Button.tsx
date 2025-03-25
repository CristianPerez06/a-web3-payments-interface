import cn from 'classnames';

import styles from './Button.module.scss';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  isDisabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
  type?: 'button' | 'submit' | 'reset';
  containerClass?: string;
}

type Comp = (props: ButtonProps) => React.ReactNode;

const Button: Comp = ({
  children,
  onClick,
  isDisabled = false,
  variant = 'primary',
  type = 'button',
  containerClass,
}) => {
  return (
    <button
      className={cn(styles['container'], containerClass, styles[variant])}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
