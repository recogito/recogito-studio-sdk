import { forwardRef, type ReactNode, type Ref } from 'react';
import { Spinner } from '../Spinner';

import './Button.css';

interface ButtonProps {
  busy?: boolean;

  children: ReactNode;

  className?: string;

  disabled?: boolean;

  type?: 'submit' | 'button';

  onClick?(evt: React.MouseEvent): void;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { busy, children, ...rest } = props;

    const className = `${props.className || ' '} ${busy ? 'busy' : ''}`.trim();

    return (
      <button ref={ref} className={className} {...rest}>
        {children}

        {busy && <Spinner className="button-busy-spinner" size={16} />}
      </button>
    );
  },
);
