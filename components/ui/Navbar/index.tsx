'use cient';

import NextLink from 'next/link';

import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Navbar = () => {
	return (
		<AppBar position={'static'}>
			<Toolbar>
				<Typography variant={'h6'}>Jam Blog</Typography>
			</Toolbar>
			<Stack direction={'row'} spacing={2}>
				<List>
					<ListItem>
						<Link
							href={'/'}
							component={NextLink}
						>
							Home
						</Link>
					</ListItem>
					<ListItem>
						<Link
							href={'/topics'}
							component={NextLink}
						>
							Topics
						</Link>
					</ListItem>
					<ListItem>
						<Link
							href={'/about'}
							component={NextLink}
						>
							About
						</Link>
					</ListItem>
				</List>
			</Stack>
		</AppBar>
	);
};

export default Navbar;
