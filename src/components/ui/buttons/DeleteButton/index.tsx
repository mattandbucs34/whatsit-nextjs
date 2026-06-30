'use client';

import IconButton from '@mui/material/IconButton';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

interface DeleteButtonProps {
    onClick: () => void;
}

export const DeleteButton = ({ onClick }: DeleteButtonProps) => {
    return (
        <IconButton
            onClick={onClick}
            color={'error'}
            sx={{
                border: '1px solid',
                borderColor: 'rgba(248, 81, 73, 0.25)',
                background: 'rgba(248, 81, 73, 0.12)',
                backdropFilter: 'blur(12px)',
                borderRadius: 0.75,
            }}
        >
            <DeleteRoundedIcon />
        </IconButton>
    );
};

export default DeleteButton;
