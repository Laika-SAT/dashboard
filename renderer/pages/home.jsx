import React, {useContext, useState} from 'react';
import {Box, Grid, Typography} from "@mui/material";
import MissionForm from "../components/Home/MissionForm";
import MissionsList from "../components/Home/MissionsList";
import { useRouter } from "next/router";
import AppContext from '../components/store/app.context';

function Home() {
    const router = useRouter(),
        { setMission } = useContext(AppContext);

    const handleMissionRedirect = (data) => {
        console.log('---- SETTING MISSION TO ----', data);
        setMission(data);
        setTimeout(() => {
            router.push('/dashboard');
        }, 0);
    };

    return (
        <div className={'h-centered'}>
            <Grid container alignItems={'center'} justifyContent={'center'} className={'container-menu'} spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
                        <img style={{ width: '150px', height: '150px' }} src={'/icons/logo.svg'}/>
                        <Typography variant={'h4'} textTransform={'capitalize'}>LAIKA SAT</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <MissionForm onMissionStarted={handleMissionRedirect} />
                    <br />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={'body1'} sx={{ fontWeight: 'bold' }}>
                        Últimas misiones
                    </Typography>
                    <MissionsList onMissionClicked={handleMissionRedirect} />
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;
