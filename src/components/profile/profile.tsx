import { type ReactNode, useEffect, useState } from 'react';
import { IoEye } from 'react-icons/io5';
import { MdArrowOutward } from 'react-icons/md';
import type { z } from 'zod/mini';
import { padNumber } from '@/helpers/number';
import { cn } from '@/helpers/styles';
import { ProfileSchema } from '@/validators/profile';
import { Container } from '../container';
import styles from './profile.module.css';

type ProfileData = z.infer<typeof ProfileSchema>;
type ProfileSection = NonNullable<ProfileData['sections']>[number];
type ValidationError = {
  message: string;
  path: string;
};

interface ProfileProps {
  source: string;
  visits: number;
}

export function Profile({ source, visits }: ProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setProfile(null);
      setErrors([]);
      setError('');

      const response = await fetch(source);

      if (!response.ok) {
        if (!cancelled) {
          setError('Profile not found.');
        }

        return;
      }

      const data = await response.json();
      const parsed = ProfileSchema.safeParse(data);

      if (!parsed.success) {
        if (!cancelled) {
          setErrors(
            parsed.error.issues.map(issue => ({
              message: issue.message,
              path: issue.path.join(' -> '),
            })),
          );
        }

        return;
      }

      if (!cancelled) {
        setProfile(parsed.data);
      }
    }

    loadProfile().catch(() => {
      if (!cancelled) {
        setError('Something went wrong. The JSON file might be invalid.');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [source]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    const previousTitle = document.title;
    const previousBackground = document.body.style.background;

    document.title = `${profile.name} - OPN`;

    if (profile.style?.theme === 'light') {
      document.body.style.background = 'var(--color-neutral-950)';
    }

    return () => {
      document.title = previousTitle;
      document.body.style.background = previousBackground;
    };
  }, [profile]);

  if (error) {
    return <ProfileError message={error} />;
  }

  if (errors.length > 0) {
    return <ProfileValidationErrors errors={errors} />;
  }

  if (!profile) {
    return null;
  }

  return (
    <div
      className={cn(
        profile.style?.theme === 'light' ? styles.light : styles.dark,
        profile.style?.font === 'serif' && styles.serif,
      )}
    >
      <Container>
        <div className={styles.logo} />

        <header className={styles.header}>
          <h1 className={styles.name}>{profile.name}</h1>
          <p className={styles.description}>{profile.description}</p>

          <div className={styles.profileVisits}>
            <span>
              <IoEye />
            </span>
            <strong>{padNumber(visits, 4)}</strong>
          </div>
        </header>

        <main>
          {profile.sections?.map(section => (
            <Section key={section.title} title={section.title}>
              {renderSectionContent(section)}
            </Section>
          ))}
        </main>

        <footer className={styles.footer}>
          Created using <a href="https://opn.bio">OPN</a>.
        </footer>
      </Container>
    </div>
  );
}

function renderSectionContent(section: ProfileSection) {
  switch (section.type) {
    case 'list':
      return (
        <div className={styles.items}>
          {section.items.map(item => (
            <div
              className={styles.item}
              key={`${item.title}:${item.url ?? item.date ?? 'item'}`}
            >
              {item.url ? (
                <a className={styles.title} href={item.url}>
                  {item.title}
                  <span>
                    <MdArrowOutward />
                  </span>
                </a>
              ) : (
                <p className={styles.title}>{item.title}</p>
              )}

              {item.description ? (
                <p className={styles.description}>{item.description}</p>
              ) : null}

              {item.date ? <p className={styles.date}>({item.date})</p> : null}
            </div>
          ))}
        </div>
      );
    case 'text':
      return <p className={styles.text}>{section.content}</p>;
    case 'links':
      return (
        <div className={styles.socials}>
          {section.links.map(link => (
            <a href={link.url} key={link.url}>
              {link.title}
            </a>
          ))}
        </div>
      );
  }
}

function ProfileError({ message }: { message: string }) {
  return (
    <div className={styles.singleError}>
      <Container>
        <p className={styles.errorText}>Error: {message}</p>
      </Container>
    </div>
  );
}

function ProfileValidationErrors({ errors }: { errors: ValidationError[] }) {
  return (
    <Container>
      <div className={styles.errors}>
        <h1 className={styles.title}>Wrong Format:</h1>

        {errors.map(error => (
          <p className={styles.error} key={`${error.path}:${error.message}`}>
            <span>[{error.path}]:</span> {error.message}
          </p>
        ))}
      </div>
    </Container>
  );
}

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        {title} <div />
      </h2>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
