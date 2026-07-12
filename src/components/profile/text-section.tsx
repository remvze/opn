import styles from './text-section.module.css';
import type { TextSection as TextSectionData } from './types';

interface TextSectionProps {
  section: TextSectionData;
}

export function TextSection({ section }: TextSectionProps) {
  return <p className={styles.text}>{section.content}</p>;
}
