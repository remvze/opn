import type { z } from 'zod/mini';
import { ProfileSchema } from '@/validators/profile';

export type ProfileData = z.infer<typeof ProfileSchema>;
export type ProfileSection = NonNullable<ProfileData['sections']>[number];
export type ListSection = Extract<ProfileSection, { type: 'list' }>;
export type TextSection = Extract<ProfileSection, { type: 'text' }>;
export type LinksSection = Extract<ProfileSection, { type: 'links' }>;
export type StackSection = Extract<ProfileSection, { type: 'stack' }>;

export type ValidationError = {
  message: string;
  path: string;
};
