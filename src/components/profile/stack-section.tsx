import styles from './stack-section.module.css';
import type { StackSection as StackSectionData } from './types';

interface StackSectionProps {
  section: StackSectionData;
}

export function StackSection({ section }: StackSectionProps) {
  return (
    <ul className={styles.stack}>
      {section.stack.map(item => (
        <li className={styles.stackItem} key={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
