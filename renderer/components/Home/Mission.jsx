import {Box, Card, CardActionArea, Grid, IconButton, Stack, Typography} from "@mui/material";
import moment from "moment/moment";
import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from "@emotion/react";
import DownloadIcon from '@mui/icons-material/Download';

const MODE_DICT = {
    simulation: 'Simulación',
    live: 'Live'
}
function Mode ({ value }) {
    return <Box sx={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
        <Box sx={{ width: '100%', backgroundColor: value === 'live' ? 'rgba(63, 226, 92, 0.5)' : 'rgba(255, 216, 10, 0.5)', border: value === 'live' ? '1px solid #3FE25C' : '1px solid #FFD80A', padding: '5px 10px', borderRadius: '8px' }}>
            <Typography variant={'subtitle2'} textAlign={'center'}>
                {MODE_DICT[value]}
            </Typography>
        </Box>
    </Box>
}

export default function Mission ({ data, onRestore, onDelete }) {
    const theme = useTheme();

    return <Card sx={{ width: '100%', border: '1px solid #4660FF', padding: theme.spacing(0.5, 3) }}>
        <Stack direction={'row'} sx={{ width: '100%' }} alignItems={'center'} justifyContent={'space-between'}>
            <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
                <Typography variant={'h4'} sx={{ fontSize: '1.5rem' }}>
                    {data?.id}
                </Typography>
            </Box>
            <Box sx={{ paddingLeft: '10px' }}>
                <Typography variant={'subtitle1'} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} disable>
                    {data?.name}
                </Typography>
                <Typography variant={'caption'} sx={{ color: '#ddd', whiteSpace: 'nowrap' }}>
                    {moment(data?.startDate).format('DD/MM/YYYY HH:ss')} - {moment(data?.endDate).format('DD/MM/YYYY HH:ss')}
                </Typography>
            </Box>
            <Box sx={{ width: '150px' }} px={2}>
                <Mode value={data?.mode} />
            </Box>
            <Stack direction={'row'}>
                <IconButton>
                    <DownloadIcon />
                </IconButton>
                <IconButton color={'error'} onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
                <IconButton onClick={onRestore}>
                    <ArrowForwardIcon />
                </IconButton>
            </Stack>
        </Stack>
    </Card>
}