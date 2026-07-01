import { getUserProfile } from '@/db/queries/users';
import { notFound } from 'next/navigation';
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import NextLink from 'next/link';
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const UserProfilePage = async ({ params }: PageProps) => {
    const { id } = await params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
        notFound();
    }

    const profileData = await getUserProfile(userId);

    if (!profileData) {
        notFound();
    }

    const { user, posts, comments, favorites } = profileData;

    return (
        <Container maxWidth={'lg'} sx={{ mt: 4, mb: 8 }}>
            {/* Header Card with Profile Info */}
            <Card
                variant={'outlined'}
                sx={{
                    background: 'rgba(22, 27, 34, 0.4)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    mb: 4,
                    p: 3,
                }}
            >
                <CardContent>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={'center'}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                fontSize: '2rem',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #1f6feb 0%, #eb731d 100%)',
                            }}
                        >
                            {user.email.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Stack spacing={0.5} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant={'h4'} component={'h1'} sx={{ fontWeight: 800 }}>
                                {user.email}
                            </Typography>
                            <Typography variant={'body2'} color={'text.secondary'}>
                                Role: {user.role.toUpperCase()} • Joined on {new Date(user.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            {/* Lists grid */}
            <Grid2 container spacing={4}>
                {/* Posts Column */}
                <Grid2 size={{ xs: 12, md: 4 }}>
                    <Card
                        variant={'outlined'}
                        sx={{
                            height: '100%',
                            background: 'rgba(22, 27, 34, 0.2)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Stack direction={'row'} spacing={1} alignItems={'center'} mb={2}>
                                <PostAddRoundedIcon color={'primary'} />
                                <Typography variant={'h5'} sx={{ fontWeight: 700 }}>
                                    Latest Posts
                                </Typography>
                            </Stack>
                            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 2 }} />

                            {posts.length > 0 ? (
                                <List disablePadding={true}>
                                    {posts.map((post) => (
                                        <ListItem
                                            key={post.id}
                                            disableGutters={true}
                                            sx={{
                                                borderBottom: '1px solid',
                                                borderColor: 'rgba(255, 255, 255, 0.06)',
                                                '&:last-child': { borderBottom: 'none' },
                                                py: 1.5,
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        component={NextLink}
                                                        href={`/topics/${post.topicId}/posts/${post.id}`}
                                                        variant={'subtitle1'}
                                                        sx={{
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                            color: 'text.primary',
                                                            '&:hover': { color: 'primary.main' }
                                                        }}
                                                    >
                                                        {post.title}
                                                    </Typography>
                                                }
                                                secondary={new Date(post.createdAt).toLocaleDateString()}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography color={'text.secondary'} variant={'body2'}>
                                    No posts created yet.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Comments Column */}
                <Grid2 size={{ xs: 12, md: 4 }}>
                    <Card
                        variant={'outlined'}
                        sx={{
                            height: '100%',
                            background: 'rgba(22, 27, 34, 0.2)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Stack direction={'row'} spacing={1} alignItems={'center'} mb={2}>
                                <CommentRoundedIcon sx={{ color: '#eb731d' }} />
                                <Typography variant={'h5'} sx={{ fontWeight: 700 }}>
                                    Latest Comments
                                </Typography>
                            </Stack>
                            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 2 }} />

                            {comments.length > 0 ? (
                                <List disablePadding={true}>
                                    {comments.map((comment) => (
                                        <ListItem
                                            key={comment.id}
                                            disableGutters={true}
                                            sx={{
                                                borderBottom: '1px solid',
                                                borderColor: 'rgba(255, 255, 255, 0.06)',
                                                '&:last-child': { borderBottom: 'none' },
                                                py: 1.5,
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        variant={'body2'}
                                                        sx={{
                                                            color: 'text.primary',
                                                            mb: 0.5,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        &quot;{comment.body}&quot;
                                                    </Typography>
                                                }
                                                secondary={
                                                    comment.post ? (
                                                        <span>
                                                            On:{' '}
                                                            <Typography
                                                                component={NextLink}
                                                                href={`/topics/${comment.post.topicId}/posts/${comment.post.id}`}
                                                                variant={'caption'}
                                                                sx={{
                                                                    textDecoration: 'none',
                                                                    color: 'primary.main',
                                                                    fontWeight: 500,
                                                                    '&:hover': { textDecoration: 'underline' }
                                                                }}
                                                            >
                                                                {comment.post.title}
                                                            </Typography>
                                                        </span>
                                                    ) : (
                                                        'On deleted post'
                                                    )
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography color={'text.secondary'} variant={'body2'}>
                                    No comments written yet.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Favorites Column */}
                <Grid2 size={{ xs: 12, md: 4 }}>
                    <Card
                        variant={'outlined'}
                        sx={{
                            height: '100%',
                            background: 'rgba(22, 27, 34, 0.2)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Stack direction={'row'} spacing={1} alignItems={'center'} mb={2}>
                                <StarRoundedIcon sx={{ color: '#f5c518' }} />
                                <Typography variant={'h5'} sx={{ fontWeight: 700 }}>
                                    Favorites
                                </Typography>
                            </Stack>
                            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 2 }} />

                            {favorites.length > 0 ? (
                                <List disablePadding={true}>
                                    {favorites.map((fav) => (
                                        <ListItem
                                            key={fav.id}
                                            disableGutters={true}
                                            sx={{
                                                borderBottom: '1px solid',
                                                borderColor: 'rgba(255, 255, 255, 0.06)',
                                                '&:last-child': { borderBottom: 'none' },
                                                py: 1.5,
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    fav.post ? (
                                                        <Typography
                                                            component={NextLink}
                                                            href={`/topics/${fav.post.topicId}/posts/${fav.post.id}`}
                                                            variant={'subtitle2'}
                                                            sx={{
                                                                fontWeight: 600,
                                                                textDecoration: 'none',
                                                                color: 'text.primary',
                                                                '&:hover': { color: 'primary.main' }
                                                            }}
                                                        >
                                                            {fav.post.title}
                                                        </Typography>
                                                    ) : (
                                                        <Typography color={'text.secondary'} variant={'body2'}>
                                                            Deleted Post
                                                        </Typography>
                                                    )
                                                }
                                                secondary={new Date(fav.createdAt).toLocaleDateString()}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography color={'text.secondary'} variant={'body2'}>
                                    No favorites added yet.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Container>
    );
};

export default UserProfilePage;
