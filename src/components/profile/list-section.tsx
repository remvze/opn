import { MdArrowOutward } from 'react-icons/md';
import styles from './list-section.module.css';
import type { ListSection as ListSectionData } from './types';

interface ListSectionProps {
  section: ListSectionData;
}

export function ListSection({ section }: ListSectionProps) {
  return (
    <div className={styles.items}>
      {section.items.map(item => (
        <div
          className={styles.item}
          key={`${item.title}:${item.url ?? item.date ?? 'item'}`}
        >
          {item.url ? (
            <a className={styles.itemTitleLink} href={item.url}>
              {item.title}
              <span>
                <MdArrowOutward />
              </span>
            </a>
          ) : (
            <p className={styles.itemTitle}>{item.title}</p>
          )}

          {item.description ? (
            <p className={styles.itemDescription}>{item.description}</p>
          ) : null}

          {item.date ? <p className={styles.itemDate}>({item.date})</p> : null}
        </div>
      ))}
    </div>
  );
}
