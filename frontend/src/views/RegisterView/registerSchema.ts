import { z } from 'zod';

const str = (msg: string) =>
  z.preprocess((v) => v ?? '', z.string().min(1, msg));

export const registerSchema = z
  .object({
    name: str('O nome é obrigatório.').pipe(
      z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    ),
    email: str('O e-mail é obrigatório.').pipe(
      z.string().email('Digite um e-mail válido.'),
    ),
    password: str('A senha deve ter no mínimo 8 caracteres.').pipe(
      z
        .string()
        .min(8, 'A senha deve ter no mínimo 8 caracteres.')
        .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
        .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
        .regex(
          /[^A-Za-z0-9]/,
          'A senha deve conter pelo menos um símbolo especial.',
        ),
    ),
    confirmPassword: str('A confirmação de senha é obrigatória.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });
