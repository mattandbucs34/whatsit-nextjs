'use client';

import Chip from '@mui/material/Chip';

interface FlairBadgeProps {
    name: string | null;
    color?: string | null;
    size?: 'small' | 'medium';
    onDelete?: () => void;
    onClick?: () => void;
}

export const FlairBadge = ({
    name,
    color = '#58A6FF',
    size = 'small',
    onDelete,
    onClick,
}: FlairBadgeProps) => {
    const badgeColor = color || '#58A6FF';
    const badgeName = name || 'General';

    return (
        <Chip
            label={badgeName}
            size={size}
            onClick={onClick}
            onDelete={onDelete}
            sx={{
                fontWeight: 700,
                fontSize: size === 'small' ? '0.7rem' : '0.8rem',
                color: badgeColor,
                borderColor: `${badgeColor}66`, // 40% border opacity
                background: `${badgeColor}1a`, // 10% background tint
                backdropFilter: 'blur(4px)',
                borderRadius: '6px',
                px: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': onClick
                    ? {
                          background: `${badgeColor}33`,
                          borderColor: badgeColor,
                          transform: 'translateY(-1px)',
                      }
                    : {},
            }}
            variant={'outlined'}
        />
    );
};
