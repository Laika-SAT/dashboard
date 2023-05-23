import { useTheme } from '@emotion/react';
import { Typography, Box, Fade } from '@mui/material';
import React from 'react';

function HirarchyText ({ children, n }) {
    switch (n) {
        case 0:
            return <Typography variant={'h5'} style={{ fontSize: '20px', fontWeight: 'bold' }}>
                {children}
            </Typography>
        case 1: 
            return <Typography variant={'body1'} style={{ fontSize: '17px', pacity: '90%' }}>
                {children}
            </Typography>
        case 2:
            return <Typography variant={'body2'} style={{ fontSize: '14px', opacity: '80%' }}>
                {children}
            </Typography>
        default:
            return <Typography>
                {children}
            </Typography>
    }
}

function StarWarsLogs ({ logs, n = 3 }) {
    const theme = useTheme();

    return <Box textAlign={'center'} marginTop={theme.spacing(-3)}>
        <Typography variant={'caption'}>
            ...
        </Typography>
        {
            logs.slice(logs.length-n).reverse().map((packet, index) => 
                <HirarchyText key={index} n={index}>
                    {packet?.log}
                </HirarchyText>
            ).reverse()
        }
    </Box>
}

export default StarWarsLogs;