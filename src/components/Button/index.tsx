import React, { ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

import IButton from './Button';
import s from './Button.module.scss';

const Button: React.FC<
  IButton.IProps & ButtonHTMLAttributes<HTMLButtonElement>
> = ({
  children,
  variant = 'black',
  size = 'md',
  className,
  type = 'button',
  borderRounded = false,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        s.Button,
        className,
        variant === 'black' && s.Button__black,
        variant === 'outline-black' && s.Button__outlineBlack,
        variant === 'white' && s.Button__white,
        variant === 'outline-white' && s.Button__outlineWhite,
        variant === 'cta-anim' && s.Button__ctaAnim,
        variant === 'cta-border' && s.Button__ctaBorder,
        variant === 'cta-none' && s.Button__ctaNone,
        size === 'xl' && s.Button__xl,
        size === 'lg' && s.Button__lg,
        size === 'md' && s.Button__md,
        size === 'sm' && s.Button__sm,
        size === 'xs' && s.Button__xs,
        borderRounded && s.Button_rouneded
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
