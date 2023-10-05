import { z } from 'zod';

export const profileSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(3, { message: 'Name must contain at least 3 characters' })
    .max(50, { message: 'Name must contain at most 50 characters' }),
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, { message: 'Username must contain at least 3 characters' })
    .max(50, { message: 'Username must contain at most 50 characters' })
    .regex(/^\S+$/, { message: 'Username must not contain spaces' }),
  bio: z
    .string()
    .max(160, { message: 'Bio must contain at most 160 characters' })
    .nullish(),
});

export type ProfileForm = z.infer<typeof profileSchema>;
