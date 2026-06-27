'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface DeleteConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export const DeleteConfirmDialog = ({
    open,
    title,
    description,
    onClose,
    onConfirm,
    isLoading = false,
}: DeleteConfirmDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    // Give it a sleek glassmorphic style matching the theme
                    background: 'rgba(22, 27, 34, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    borderRadius: 3,
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                {title}
            </DialogTitle>
            <DialogContent sx={{ color: 'text.secondary' }}>
                {description}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
                <Button
                    onClick={onClose}
                    disabled={isLoading}
                    variant={'outlined'}
                    color={'primary'}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    variant={'contained'}
                    color={'error'}
                >
                    {isLoading ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
