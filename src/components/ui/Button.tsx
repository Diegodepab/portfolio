import React from 'react';
import type { AnchorHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  href, 
  variant = 'outline', 
  size = 'md',
  className = '',
  ...props 
}) => {
  return (
    <a
      href={href}
      className={`button button--${variant} button--${size} btn-${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </a>
  );
};
