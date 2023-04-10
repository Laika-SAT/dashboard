import React, {useState} from 'react';
import {Box, Button, Card, CardContent, Grid, List, ListItem, MenuItem, TextField, Typography} from "@mui/material";
import {TimePicker} from "@mui/x-date-pickers";
import moment from 'moment';
import MissionForm from "../components/Home/MissionForm";

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

function Mission ({ data }) {
    return <Card sx={{ width: '100%', border: '1px solid #4660FF', padding: '4px 8px' }}>
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
    </Card>
}

function Home() {
    const [startTime, setStartTime] = useState(moment());
    return (
        <div className={'centered-container'}>
            <Grid container alignItems={'center'} justifyContent={'center'} className={'container-menu'} spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                        <img style={{ width: '150px', height: '150px' }} src={'/icons/logo.svg'}/>
                        <Typography variant={'h4'} textTransform={'capitalize'}>LAIKA SAT</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <MissionForm />
                    <br />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
                        Últimas misiones
                    </Typography>
                    <List>
                        {
                            [
                                {id: 3, name: 'Misión de prueba 3', startDate: moment(), endDate: moment(), mode: 'simulation'},
                                {id: 2, name: 'Misión de prueba 2', startDate: moment(), endDate: moment(), mode: 'live'},
                                {id: 1, name: 'Misión de prueba 1', startDate: moment(), endDate: moment(), mode: 'simulation'},
                            ].map((data, index) => (
                                <ListItem key={index} sx={{padding: 0, marginBottom: '5px'}}>
                                    <Mission data={data}/>
                                </ListItem>
                            ))
                        }
                    </List>
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;
