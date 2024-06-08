import React from 'react';
import { Typography } from '@mui/material';

interface ProfileFieldProps {
    label: string;
    value: string | string[];
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => {
    return (
        <Typography color="text.secondary">
            <strong>{label}:</strong> {Array.isArray(value) ? value.join(', ') : value}
        </Typography>
    );
};

export default ProfileField;
