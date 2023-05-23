import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {Backdrop, Box, CircularProgress, Grid, Stack, Typography} from "@mui/material";
import AppContext from '../../components/store/app.context';
import DashboardFooter from '../../components/Dashboard/DashboardFooter';
import DashboardPanel from '../../components/Dashboard/DashboardPanel';
import { useTheme } from '@emotion/react';
import PayloadScene from "../../components/Dashboard/PayloadModel";
import PayloadState from "../../components/Dashboard/PayloadState";
import {useRouter} from "next/router";
import electron from 'electron';
import DashboardChart from '../../components/Dashboard/Chart';
import StarWarsLogs from '../../components/Dashboard/StarWarsLogs';
const ipcRender = electron.ipcRenderer || false;
import CircleIcon from '@mui/icons-material/Circle';
import Battery from '../../components/Dashboard/Battery';


function useMissionTime (started) {
    const [seconds, setSeconds] = useState(0),
        [minutes, setMinutes] = useState(0);

    useEffect(() => {
        if (!started) return;
        const i = setInterval(() => {
            setSeconds((t) => t + 1);
        }, 1000);
        return () => {
            clearInterval(i);
        }
    }, [started]);

    useEffect(() => {
        if (seconds === 60) {
          setSeconds(0);
          setMinutes((m) => m + 1);
        }
      }, [seconds, minutes]);

    return [minutes, seconds];
}


function addZ(num) {
    return num < 10 ? '0' + (num || 0) : num || 0;
}

export default function DashboardPage () {
    const [mission, setMission] = useState(null),
        theme = useTheme(),
        [ws, setWS] = useState(null),
        [initialized, setInitialized] = useState(false),
        [packets, setPackets] = useState([]),
        renderedPackets = 50,
        router = useRouter(),
        missionId = useMemo(() => router.query?.id, [router.query]),
        [recording, setRecording] = useState(false),
        time = useMissionTime(recording),
        [lastReceivedPackage, setLastReceivedPackage] = useState(null),
        startDate = useMemo(() => Math.floor(new Date(mission?.startDate).getTime() / 1000));

    const handleFetchPreviousPackets = useCallback(async () => {
        const fetchMission = async (id) => {
            console.log('ID', id);
            const data = await ipcRender.invoke('missions:get', id);
            return data;
        };

        const fetchPackets = async (id) => {
            const previousData = await ipcRender.invoke('metrics:listJSON', JSON.stringify({
                filter: {
                    mission: id,
                    valid: true,
                },
                options: {
                    num: 50,
                    ord: 'timestamp',
                    asc: false
                }
            }));
            return previousData || null;
        };
        
        try {
            const m = await fetchMission(missionId);
            setMission(m);
            const previousPackets = await fetchPackets(missionId);
            if (previousPackets) {
                setPackets((currentPackets) => [...previousPackets.data, ...currentPackets]);
            }
            setInitialized(true);
        } catch (error) {
            console.error('ERROR WHILE GETTING previous data');
        }
    }, [missionId]);

    const handleNewData = useCallback((message) => {
        setPackets((prevPackets) => {
            const newPackets = prevPackets.slice();
            if (newPackets?.length === renderedPackets) {
                newPackets.shift();
            }
            const parsedMessage = JSON.parse(message.data);
            newPackets.push(parsedMessage);
            return newPackets;
        });
    }, [setPackets]);

    const handleFinishMission = () => {
        setMission(null);
        router.push('/');
    };

    const handleStartRecording = useCallback(() => {
        ws.send(JSON.stringify({
            action: 'SET_RECORDING',
            payload: true,
        }));
        setRecording(true);
    }, [ws]);

    const handleFinishRecording = useCallback(() => {
        ws.send(JSON.stringify({
            action: 'SET_RECORDING',
            payload: false,
        }));
        setRecording(false);
    }, [ws]);

    useEffect(() => {
        if (!packets?.length) return;
        setLastReceivedPackage(packets[packets?.length-1]);
    }, [packets]);

    useEffect(() => {
        if (!initialized) return;
        if (ws) return;
        const newWs = new WebSocket('ws://localhost:1040');
        newWs.onerror = (error) => console.error('WS ERROR: ', error);
        newWs.onopen = () => {
            setWS(newWs);
            newWs.send(JSON.stringify({
                action: 'SET_MISSION', 
                payload: mission 
            }));
        };
        newWs.onmessage = handleNewData;
        return () => {
            newWs.close();
        };
    }, [initialized]);

    useEffect(() => {
        if (!missionId) return;
        if (initialized) return;
        handleFetchPreviousPackets();
    }, [missionId]);

    if (!missionId) return <Backdrop>
        <CircularProgress />
    </Backdrop>;

    const labels = packets?.map(p => p.timestamp - startDate);

    return <div className={'dashboard-container'}>
        <main className={'d-main'}>
            <Grid container>
                <Grid item xs={3.5}>
                    <div style={{ height: '90vh', display: 'grid', gridTemplate: '1fr 1fr 1fr / 100%', paddingTop: theme.spacing(1), padding: theme.spacing(3), gap: theme.spacing(3) }}>
                        <DashboardChart 
                            textLabel={'Temperatura'}
                            data={{
                                labels,
                                datasets: [
                                    {
                                        label: 'temperature',
                                        fill: false,
                                        data: packets.map(p => p?.temperature),
                                        borderColor: '#6979F8',
                                        tension: 0.4
                                    },
                                ]
                            }}
                        />
                        <DashboardChart
                            showLabels
                            textLabel={'Aceleración'}
                            data={{
                                labels,
                                datasets: [
                                    {
                                        label: 'x',
                                        fill: false,
                                        data: packets?.map(p => p?.acx_1),
                                        borderColor: '#6979F8',
                                        tension: 0.4
                                    },
                                    {
                                        label: 'y',
                                        fill: false,
                                        data: packets?.map(p => p?.acy_1),
                                        borderColor: '#ff1053',
                                        tension: 0.4
                                    },
                                    {
                                        label: 'z',
                                        fill: false,
                                        data: packets?.map(p => p?.acz_1),
                                        borderColor: '#FFD166',
                                        tension: 0.4
                                    },
                                ]
                            }}
                        />
                        <DashboardChart 
                            showLabels
                            textLabel={'Velocidad'}
                            data={{
                                labels,
                                datasets: [
                                    {
                                        label: 'x',
                                        fill: false,
                                        data: packets?.map(p => p?.vx_1),
                                        borderColor: '#6979F8',
                                        tension: 0.4
                                    },
                                    {
                                        label: 'y',
                                        fill: false,
                                        data: packets?.map(p => p?.vy_1),
                                        borderColor: '#ff1053',
                                        tension: 0.4
                                    },
                                    {
                                        label: 'z',
                                        fill: false,
                                        data: packets?.map(p => p?.vz_1),
                                        borderColor: '#FFD166',
                                        tension: 0.4
                                    }
                                ]
                            }}
                        />
                    </div>
                </Grid>
                <Grid item xs={5}>
                    <Box p={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <DashboardPanel style={{ width: '50%' }}>
                            <Box px={5} style={{ width: '100%', backgroundColor: 'rgba(72, 69, 231, 0.16)', border: '1px solid #38405E', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <img src={'/svg/software_status.svg'} />
                                <Box p={0.5} textAlign={'center'}>
                                    <Typography variant={'caption'} sx={{ fontWeight: 'bold' }}>
                                        Descending
                                    </Typography>
                                </Box>
                            </Box>
                        </DashboardPanel>
                    </Box>
                    <PayloadState 
                        ascent={true}
                        payloadRelease={true}
                        autogiro={true}
                        maxHighReached={false}
                    />
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} py={2}>
                        <Box textAlign={'center'}>
                            <Typography variant={'caption'}>
                                Ángulo Z
                            </Typography>
                            <Typography variant={'h5'} style={{ fontWeight: 'bold' }}>
                                {lastReceivedPackage?.orz_1}°
                            </Typography>
                        </Box>
                    </Box>
                    <Grid container alignItems={'center'} justifyContent={'center'}>
                        <Grid item xs={2}>
                            <Box textAlign={'center'}>
                                <Typography variant={'caption'}>
                                    Ángulo X
                                </Typography>
                                <Typography variant={'h5'} style={{ fontWeight: 'bold' }}>
                                    {lastReceivedPackage?.orx_1}°
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <PayloadScene
                                orx={lastReceivedPackage?.orx_1}
                                ory={lastReceivedPackage?.ory_1}
                                orz={lastReceivedPackage?.orz_1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Box textAlign={'center'}>
                                <Typography variant={'caption'}>
                                    Ángulo Y
                                </Typography>
                                <Typography variant={'h5'} style={{ fontWeight: 'bold' }}>
                                    {lastReceivedPackage?.ory_1}°
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <StarWarsLogs
                        n={3}
                        logs={
                            [
                                { log: 'modo de descenso activado' },
                                { log: 'el sistema de autogiro se ha iniciado' },
                                { log: '250 metros alcanzados' },
                            ]
                        }
                    />
                </Grid>
                <Grid item xs={3.5}>
                    <div style={{ 
                        height: '90vh', 
                        display: 'grid', 
                        gridTemplate: '0.5fr 0.5fr 1fr 1fr / 100%', 
                        paddingTop: theme.spacing(1), 
                        padding: theme.spacing(3), 
                        gap: theme.spacing(3) 
                    }}>
                        <DashboardPanel>
                            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'} spacing={2} sx={{ px: 2 }}>
                                <Typography variant={'body1'} style={{ fontWeight: 'bold' }}>
                                    {mission?.name}
                                </Typography>
                                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} spacing={2} sx={{ height: '100%' }}>
                                    <Battery percentage={lastReceivedPackage?.voltaje_1} />
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 'fit-content' }}>
                                        {
                                            recording && <Typography variant={'caption'} sx={{ pr: 1}}>
                                                REC
                                            </Typography>
                                        }
                                        <div style={{
                                            width: '15px', 
                                            height: '15px', 
                                            backgroundColor: recording ? 'red' : 'gray', 
                                            borderRadius: '50%' 
                                        }} />
                                    </div>
                                </Stack>
                            </Stack>
                        </DashboardPanel>
                        <DashboardPanel style={{ textAlign: 'center' }}>
                            <Stack direction='row' justifyContent={'space-evenly'} alignItems={'center'}>
                                <Typography variant='subtitle' style={{ fontWeight: 'bold'}}>
                                    Tiempo de la misión (minutos)
                                </Typography>
                            </Stack>
                            <Box py={2}>
                                <Typography variant={'h2'} style={{ letterSpacing: '2px' }}>
                                    {addZ(time[0])}:{addZ(time[1])}
                                </Typography>
                            </Box>
                        </DashboardPanel>
                        <DashboardChart
                            textLabel={'Altura'}
                            data={{
                                labels,
                                datasets: [
                                    {
                                        label: 'elevacion',
                                        fill: false,
                                        data: packets?.map(p => p?.high),
                                        borderColor: '#6979F8',
                                        tension: 0.4
                                    }
                                ]
                            }}
                        />
                        <DashboardChart 
                            textLabel={'Presión atmosférica'}
                            data={{
                                labels,
                                datasets: [
                                    {
                                        label: 'presion',
                                        fill: false,
                                        data: packets?.map(p => p?.pressure),
                                        borderColor: '#6979F8',
                                        tension: 0.4
                                    }
                                ]
                            }}
                        />
                    </div>
                </Grid>
            </Grid>
        </main>
        <DashboardFooter 
            recording={recording}
            mission={mission}
            onFinish={handleFinishMission}
            onStartRecording={handleStartRecording}
            onFinishRecording={handleFinishRecording}
        />
    </div>
}

export function getInitialProps ({ router }) {
    return { missionId: router.query?.id }
}