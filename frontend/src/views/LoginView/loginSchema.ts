import { z } from 'zod';

const str = (msg: string) =>
  z.preprocess((v) => v ?? '', z.string().min(1, msg));

export const loginSchema = z.object({
  email: str('O e-mail é obrigatório.').pipe(
    z.string().email('Digite um e-mail válido.'),
  ),
  password: str('A senha é obrigatória.'),
});
