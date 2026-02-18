import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  subtitle?: ReactNode;
};

export function Card({ title, subtitle, className = '', children, ...props }: CardProps) {
  return (
    <section className={`ds-card ${className}`.trim()} {...props}>
      {title ? <h2 className="ds-card-title">{title}</h2> : null}
      {subtitle ? <p className="ds-card-subtitle">{subtitle}</p> : null}
      {children}
    </section>
  );
}
