'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import NextLink from 'next/link';
import { signIn as nextAuthSignIn } from 'next-auth/react';
import { signInSchema, SignInInput } from '@/lib/validations/auth';
import { signInAction } from '../auth/action';

interface SignInPageClientProps {
    callbackUrl?: string;
}

const SignInPageClient = ({ callbackUrl }: SignInPageClientProps) => {
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: SignInInput) => {
        setError(null);
        try {
            const result = await signInAction(data);
            if (result?.error) {
                setError(result.error);
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await nextAuthSignIn('google', { callbackUrl: callbackUrl || '/topics' });
        } catch (err) {
            console.error(err);
            setError('Google sign-in failed. Please try again.');
        }
    };

    const handleDemoSignIn = () => {
        setValue('email', 'demo@whatsit.com');
        setValue('password', 'password123');
        // Let the state update, then submit
        setTimeout(() => {
            handleSubmit(onSubmit)();
        }, 100);
    };

    return (
        <Container maxWidth={'sm'} sx={{ mt: 8, mb: 4 }}>
            <Card
                variant={'outlined'}
                sx={{
                    background: 'rgba(22, 27, 34, 0.4)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 2,
                }}
            >
                <CardContent>
                    <Stack component={'form'} onSubmit={handleSubmit(onSubmit)} spacing={3}>
                        <Typography variant={'h4'} component={'h1'} sx={{ fontWeight: 800, textAlign: 'center' }}>
                            Sign In
                        </Typography>
                        <Typography variant={'body2'} color={'text.secondary'} sx={{ textAlign: 'center' }}>
                            Welcome back to Whatsit
                        </Typography>

                        {error && <Alert severity={'error'}>{error}</Alert>}

                        <Controller
                            name={'email'}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={'Email Address'}
                                    variant={'outlined'}
                                    fullWidth={true}
                                    error={!!errors.email}
                                    helperText={errors.email ? errors.email.message : ''}
                                />
                            )}
                        />

                        <Controller
                            name={'password'}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={'Password'}
                                    type={'password'}
                                    variant={'outlined'}
                                    fullWidth={true}
                                    error={!!errors.password}
                                    helperText={errors.password ? errors.password.message : ''}
                                />
                            )}
                        />

                        <Button
                            type={'submit'}
                            variant={'contained'}
                            color={'primary'}
                            fullWidth={true}
                            size={'large'}
                            disabled={isSubmitting}
                            sx={{ py: 1.5, fontWeight: 700 }}
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <Button
                            variant={'contained'}
                            color={'secondary'}
                            fullWidth={true}
                            size={'large'}
                            onClick={handleDemoSignIn}
                            disabled={isSubmitting}
                            sx={{
                                py: 1.5,
                                fontWeight: 700,
                                background: 'rgba(235, 115, 29, 0.15)',
                                color: '#eb731d',
                                border: '1px solid rgba(235, 115, 29, 0.3)',
                                '&:hover': {
                                    background: 'rgba(235, 115, 29, 0.25)',
                                }
                            }}
                        >
                            Sign In as Demo User
                        </Button>

                        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                            <Box sx={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />
                            <Typography variant={'body2'} color={'text.secondary'} sx={{ mx: 2 }}>
                                or
                            </Typography>
                            <Box sx={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />
                        </Box>

                        <Button
                            variant={'outlined'}
                            color={'primary'}
                            fullWidth={true}
                            size={'large'}
                            onClick={handleGoogleSignIn}
                            disabled={isSubmitting}
                            sx={{
                                py: 1.5,
                                fontWeight: 700,
                                border: '1px solid',
                                borderColor: 'rgba(88, 166, 255, 0.25)',
                                background: 'rgba(88, 166, 255, 0.05)',
                                '&:hover': {
                                    background: 'rgba(88, 166, 255, 0.12)',
                                }
                            }}
                        >
                            Sign In with Google
                        </Button>

                        <Typography variant={'body2'} color={'text.secondary'} sx={{ textAlign: 'center', mt: 2 }}>
                            Don&apos;t have an account?{' '}
                            <Button
                                component={NextLink}
                                href={'/signup'}
                                variant={'text'}
                                color={'primary'}
                                sx={{ p: 0, minWidth: 0, textTransform: 'none', fontWeight: 600, verticalAlign: 'baseline' }}
                            >
                                Sign Up
                            </Button>
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
};

export default SignInPageClient;
