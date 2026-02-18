import type { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClass: Record<BadgeVariant, string> = {
  default: 'ds-badge ds-badge-default',
  success: 'ds-badge ds-badge-success',
  warning: 'ds-badge ds-badge-warning',
  danger: 'ds-badge ds-badge-danger',
};

export function Badge({ variant = 'default', className = '', ...props }: BadgeProps) {
  return <span className={`${variantClass[variant]} ${className}`.trim()} {...props} />;
}
