import { z } from 'zod';
import { registerSchema } from './registerSchema';

export type RegisterForm = z.infer<typeof registerSchema>;
