import { z } from 'zod';

export const signUpSchema = z
    .object({
        email: z
            .string()
            .min(1, { message: 'Email is required' })
            .email('Must be a valid email address'),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters in length' }),
        passwordConfirmation: z
            .string()
            .min(1, { message: 'Password confirmation is required' }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Password confirmation does not match password',
        path: ['passwordConfirmation'],
    });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email('Must be a valid email address'),
    password: z
        .string()
        .min(1, { message: 'Password is required' }),
});

export type SignInInput = z.infer<typeof signInSchema>;

