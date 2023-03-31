import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Avatar } from '@mui/material';

export const AvatarImage = styled((props) => {
    const { selected, ...other } = props;
    return <Avatar {...other} />;
})(({ theme, selected }) => ({
    backgroundColor: selected && alpha(theme.palette.primary.main, 0.5),
    boxShadow: selected && `0 0 0 1px ${alpha(theme.palette.primary.main, 0.5)}`,
    avatarImage: {
        objectFit: 'contain',
    },
}));

export const AvatarAnimated = styled((props) => {
    const { selected, ...other } = props;
    return <AvatarImage {...other} />;
})(({ theme, selected }) => ({
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    transform: selected && 'scale(1.1)',
    '&:hover': {
        transform: 'scale(1.1)',
    },
}));
