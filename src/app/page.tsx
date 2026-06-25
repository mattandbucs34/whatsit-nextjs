import NextLink from 'next/link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

const Home = () => {
    return (
        <Container maxWidth={'lg'}>
            {/* Jumbotron Header */}
            <Box
                component={'header'}
                sx={{
                    background: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 4,
                    p: { xs: 4, md: 6 },
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    mt: 4,
                    textAlign: 'center',
                }}
            >
                <Typography
                    variant={'h2'}
                    component={'h1'}
                    sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(to right, #58a6ff, #bc8cff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2,
                        fontSize: { xs: '2.5rem', md: '3.75rem' },
                    }}
                >
                    Universe of Whatsit
                </Typography>
                <Typography
                    variant={'h6'}
                    color={'text.secondary'}
                    sx={{
                        maxWidth: '800px',
                        mx: 'auto',
                        mb: 4,
                        fontWeight: 400,
                        lineHeight: 1.6,
                    }}
                >
                    The modern community platform for sharing anything, anywhere. Connect with people who share your passions.
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent={'center'}
                    sx={{ mt: 4 }}
                >
                    <NextLink href={'/users/sign_up'} passHref style={{ textDecoration: 'none' }}>
                        <Button
                            variant={'contained'}
                            size={'large'}
                            color={'primary'}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#388bfd',
                                    boxShadow: '0 0 15px rgba(88, 166, 255, 0.4)',
                                }
                            }}
                        >
                            Get Started
                        </Button>
                    </NextLink>
                    <NextLink href={'/topics'} passHref style={{ textDecoration: 'none' }}>
                        <Button
                            variant={'outlined'}
                            size={'large'}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                color: '#c9d1d9',
                                borderColor: 'rgba(201, 209, 217, 0.4)',
                                '&:hover': {
                                    borderColor: '#c9d1d9',
                                    backgroundColor: 'rgba(201, 209, 217, 0.08)',
                                },
                            }}
                        >
                            Explore Topics
                        </Button>
                    </NextLink>
                </Stack>
            </Box>

            {/* Page Features */}
            <Box sx={{ mt: 8, mb: 4 }}>
                <Grid container spacing={4}>
                    {/* Feature 1 */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%', p: 2 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant={'h5'}
                                    component={'h2'}
                                    sx={{
                                        fontWeight: 700,
                                        background: 'linear-gradient(to right, #58a6ff, #bc8cff)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 2,
                                    }}
                                >
                                    Share Ideas
                                </Typography>
                                <Typography variant={'body1'} color={'text.secondary'}>
                                    Create posts that spark conversations and share your unique perspective with the world.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Feature 2 */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%', p: 2 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant={'h5'}
                                    component={'h2'}
                                    sx={{
                                        fontWeight: 700,
                                        background: 'linear-gradient(to right, #58a6ff, #bc8cff)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 2,
                                    }}
                                >
                                    Engage Daily
                                </Typography>
                                <Typography variant={'body1'} color={'text.secondary'}>
                                    Dive into the comments and connect with a diverse community of thinkers and creators.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Feature 3 */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: '100%', p: 2 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant={'h5'}
                                    component={'h2'}
                                    sx={{
                                        fontWeight: 700,
                                        background: 'linear-gradient(to right, #58a6ff, #bc8cff)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 2,
                                    }}
                                >
                                    Stay Current
                                </Typography>
                                <Typography variant={'body1'} color={'text.secondary'}>
                                    Follow your favorite topics and never miss a beat in the rapidly evolving world of Whatsit.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Home;
