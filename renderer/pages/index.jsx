import React, {useContext, useState} from 'react';
import {Box, Grid, Modal, Stack, Typography, Button} from "@mui/material";
import MissionForm from "../components/Home/MissionForm";
import MissionsList from "../components/Home/MissionsList";
import { useRouter } from "next/router";
import AppContext from '../components/store/app.context';

function Home() {
    const router = useRouter(),
        { setMission } = useContext(AppContext),
        [openMissionForm, setOpenMissionForm] = useState(false);

    const handleMissionRedirect = (data) => {
        console.log('---- SETTING MISSION TO ----', data);
        setMission(data);
        setTimeout(() => {
            router.push(`/dashboard/${data?.id}`);
        }, 0);
    };

    const handleCloseMissionForm = () => {
        setOpenMissionForm(false);
    }

    return (
        <div className={'h-centered'}>
            <Grid container alignItems={'center'} justifyContent={'center'} className={'container-menu'} spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Box px={4}>
                            <img style={{ width: '150px', height: '150px' }} src={'/icons/logo.svg'}/>
                        </Box>
                        <Typography variant={'h4'} textTransform={'capitalize'}>LAIKA SAT</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <MissionsList
                        onMissionClicked={handleMissionRedirect}
                        onNewMission={() => setOpenMissionForm(true)}
                    />
                </Grid>
            </Grid>
            <Modal
                open={openMissionForm}
                onClose={handleCloseMissionForm}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '30%',
                    bgcolor: '#222',
                    boxShadow: 24,
                    borderRadius: '8px',
                    pt: 2,
                }}>
                    <Box p={2} pb={0} textAlign={'center'}>
                        <Typography variant={'h4'} gutterBottom>
                            Nueva misión
                        </Typography>
                    </Box>
                    <MissionForm 
                        onMissionStarted={handleMissionRedirect} 
                        onMissionCanceled={handleCloseMissionForm}
                    />   
                </Box>
            </Modal>
        </div>
    );
}

export default Home;
