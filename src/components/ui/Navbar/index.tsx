'use client';

import NextLink from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

export const Navbar = () => {
	return (
		<AppBar
			position={'sticky'}
			color={'default'}
			elevation={0}
			sx={{ borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(8px)', backgroundColor: 'background.paper' }}
		>
			<Container maxWidth={'lg'}>
				<Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
					<Typography
						variant={'h6'}
						component={NextLink}
						href={'/'}
						sx={{
							fontWeight: 800,
							textDecoration: 'none',
							color: 'primary.main',
							letterSpacing: '-0.5px',
						}}
					>
						Whatsit
					</Typography>

					<Stack direction={'row'} spacing={2}>
						<Button component={NextLink} href={'/'} color={'inherit'}>
							Home
						</Button>
						<Button component={NextLink} href={'/topics'} color={'inherit'}>
							Topics
						</Button>
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
