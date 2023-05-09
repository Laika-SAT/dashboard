import {Box, Card, CardActionArea, Grid, Typography} from "@mui/material";
import moment from "moment/moment";
import React from "react";

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

export default function Mission ({ data }) {
    return <Card sx={{ width: '100%', border: '1px solid #4660FF', padding: '4px 8px' }}>
        <CardActionArea>
            <Grid container>
                <Grid item xs={1}>
                    <Box sx={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                        <Typography variant={'h4'} sx={{ fontSize: '1.5rem' }}>
                            {data?.id}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Box sx={{ paddingLeft: '10px' }}>
                        <Typography variant={'subtitle1'} sx={{ fontWeight: 'bold' }} disable>
                            {data?.name}
                        </Typography>
                        <Typography variant={'caption'} sx={{ color: '#ddd' }}>
                            {moment(data?.startDate).format('DD/MM/YYYY HH:ss')} - {moment(data?.endDate).format('DD/MM/YYYY HH:ss')}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <Mode value={data?.mode} />
                </Grid>
            </Grid>
        </CardActionArea>
    </Card>
}