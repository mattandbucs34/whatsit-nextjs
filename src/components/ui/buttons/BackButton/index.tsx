'use client';

import NextLink from 'next/link';
import IconButton from '@mui/material/IconButton';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';

interface BackButtonProps {
    href: string;
}

export const BackButton = ({ href }: BackButtonProps) => {
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
            <ArrowBackRounded />
        </IconButton>
    );
};

export default BackButton;
