'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import NextLink from 'next/link';

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export const AuthModal = ({
    open,
    onClose,
    title = 'Sign in required',
    description = 'You must be signed in to vote on posts and join the discussion.',
}: AuthModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    background: 'rgba(22, 27, 34, 0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
                    borderRadius: 3,
                    maxWidth: 400,
                    width: '100%',
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <Typography variant={'body2'} color={'text.secondary'}>
                    {description}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <Stack direction={'row'} spacing={1} width={'100%'} justifyContent={'flex-end'}>
                    <Button
                        onClick={onClose}
                        variant={'outlined'}
                        color={'primary'}
                    >
                        Cancel
                    </Button>
                    <Button
                        component={NextLink}
                        href={'/signin'}
                        variant={'contained'}
                        color={'primary'}
                        onClick={onClose}
                    >
                        Sign In
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};
