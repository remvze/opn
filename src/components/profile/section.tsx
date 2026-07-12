import type { ReactNode } from 'react';
import styles from './section.module.css';

interface SectionProps {
  children: ReactNode;
  title: string;
}

export function Section({ children, title }: SectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        {title} <div />
      </h2>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
