'use client';

import NextLink from 'next/link';
import IconButton from '@mui/material/IconButton';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

interface EditButtonProps {
    href: string;
}

export const EditButton = ({ href }: EditButtonProps) => {
    return (
        <IconButton
            component={NextLink}
            href={href}
            color={'primary'}
            sx={{
                border: '1px solid',
                borderColor: 'rgba(88, 166, 255, 0.25)',
                background: 'rgba(88, 166, 255, 0.12)',
                backdropFilter: 'blur(12px)',
                borderRadius: 0.75,
            }}
        >
            <EditRoundedIcon />
        </IconButton>
    );
};
export default EditButton;
