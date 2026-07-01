'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import NextLink from 'next/link';
import { signIn as nextAuthSignIn } from 'next-auth/react';
import { signUpSchema, SignUpInput } from '@/lib/validations/auth';
import { signUpAction } from '../auth/action';

const SignUpPageClient = () => {
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
            passwordConfirmation: '',
        },
    });

    const onSubmit = async (data: SignUpInput) => {
        setError(null);
        try {
            const result = await signUpAction(data);
            if (result?.error) {
                setError(result.error);
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            await nextAuthSignIn('google', { callbackUrl: '/topics' });
        } catch (err) {
            console.error(err);
            setError('Google sign-up failed. Please try again.');
        }
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
                            Create Account
                        </Typography>
                        <Typography variant={'body2'} color={'text.secondary'} sx={{ textAlign: 'center' }}>
                            Sign up to join discussions and post replies
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

                        <Controller
                            name={'passwordConfirmation'}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={'Confirm Password'}
                                    type={'password'}
                                    variant={'outlined'}
                                    fullWidth={true}
                                    error={!!errors.passwordConfirmation}
                                    helperText={errors.passwordConfirmation ? errors.passwordConfirmation.message : ''}
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
                            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
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
                            onClick={handleGoogleSignUp}
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
                            Sign Up with Google
                        </Button>

                        <Typography variant={'body2'} color={'text.secondary'} sx={{ textAlign: 'center', mt: 2 }}>
                            Already have an account?{' '}
                            <Button
                                component={NextLink}
                                href={'/signin'}
                                variant={'text'}
                                color={'primary'}
                                sx={{ p: 0, minWidth: 0, textTransform: 'none', fontWeight: 600, verticalAlign: 'baseline' }}
                            >
                                Sign In
                            </Button>
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
};

export default SignUpPageClient;
