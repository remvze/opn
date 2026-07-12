import styles from './links-section.module.css';
import type { LinksSection as LinksSectionData } from './types';

interface LinksSectionProps {
  section: LinksSectionData;
}

export function LinksSection({ section }: LinksSectionProps) {
  return (
    <div className={styles.links}>
      {section.links.map(link => (
        <a href={link.url} key={link.url}>
          {link.title}
        </a>
      ))}
    </div>
  );
}
