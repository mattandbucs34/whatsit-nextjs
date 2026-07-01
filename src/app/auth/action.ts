'use server';

import { signIn, signOut } from '@/auth';
import { getUserByEmail, createUser } from '@/db/queries/users';
import { signUpSchema, SignUpInput, signInSchema, SignInInput } from '@/lib/validations/auth';
import { AuthError } from 'next-auth';

export const signUpAction = async (data: SignUpInput) => {
    const result = signUpSchema.safeParse(data);

    if (!result.success) {
        throw new Error('Invalid input data');
    }

    const existingUser = await getUserByEmail(result.data.email);
    if (existingUser) {
        return { error: 'Email address is already in use' };
    }

    await createUser({
        email: result.data.email,
        passwordPlain: result.data.password,
    });

    try {
        await signIn('credentials', {
            email: result.data.email,
            password: result.data.password,
            redirectTo: '/topics',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: 'Failed to sign in automatically after registration' };
        }
        throw error; // Re-throw Next.js redirect errors
    }

    return { success: true };
};

export const signInAction = async (data: SignInInput) => {
    const result = signInSchema.safeParse(data);

    if (!result.success) {
        throw new Error('Invalid input data');
    }

    const { email, password } = result.data;

    if (email === 'demo@whatsit.com') {
        const existing = await getUserByEmail(email);
        if (!existing) {
            await createUser({
                email,
                passwordPlain: password,
            });
        }
    }

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: '/topics',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid email or password' };
                default:
                    return { error: 'Something went wrong. Please try again.' };
            }
        }
        throw error; // Re-throw Next.js redirect errors
    }

    return { success: true };
};

export const signOutAction = async () => {
    await signOut({ redirectTo: '/signin' });
};
