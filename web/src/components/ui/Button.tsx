import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: 'ds-btn ds-btn-primary',
  secondary: 'ds-btn ds-btn-secondary',
  ghost: 'ds-btn ds-btn-ghost',
  danger: 'ds-btn ds-btn-danger',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'ds-btn-sm',
  md: 'ds-btn-md',
};

export function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...props }: ButtonProps) {
  const cls = `${variantClass[variant]} ${sizeClass[size]} ${className}`.trim();
  return <button type={type} className={cls} {...props} />;
}
