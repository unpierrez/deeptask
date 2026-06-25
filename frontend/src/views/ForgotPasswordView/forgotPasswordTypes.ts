import { z } from "zod";
import { forgotPasswordSchema } from "./forgotPasswordSchema";

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
