import React, { useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {Box, Grid, Toolbar, Typography, speedDialActionClasses} from "@mui/material";
import AppContext from '../components/store/app.context';
import DashboardFooter from '../components/Dashboard/DashboardFooter';
import DashboardPanel from '../components/Dashboard/DashboardPanel';
import { useTheme } from '@emotion/react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { 
    Chart as ChartJS, ArcElement, Tooltip, 
    Legend, CategoryScale, LinearScale,
    PointElement, LineElement
} from "chart.js";
import { Line } from "react-chartjs-2";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

ChartJS.defaults.color = '#999999';
ChartJS.defaults.borderColor = 'rgba(228, 228, 228, 0.2)';

ChartJS.register(
    ArcElement, Tooltip, Legend, 
    CategoryScale, LinearScale,
    PointElement, LineElement
);

function PayloadModel ({ acx, acy, acz, orx, ory, orz }) {
    const obj = useLoader(OBJLoader, '/model.obj');
    let rollAngle = Math.atan2(orx, orz) * (180.0 /  Math.PI);
    let pitchAngle = Math.atan2(-orx, Math.sqrt(ory * ory + orz * orz)) * (180.0 / Math.PI);
    return <mesh position={[0, 2, 0]} scale={[0.06, 0.06, 0.06]} rotation={[ (Math.PI / 1.5) - rollAngle, pitchAngle, 0 ]}>
        <primitive object={obj} />
    </mesh>
}

export default function DashboardPage () { 
    const { mission } = useContext(AppContext),
        theme = useTheme(),
        [ws, setWS] = useState(null),
        [packets, setPackets] = useState([]),
        renderedPackets = 50, 
        [lastReceivedPackage, setLastReceivedPackage] = useState(null);

    const handleNewData = useCallback((message) => {
        setPackets((prevPackets) => {
            const newPackets = prevPackets.slice();
            if (newPackets?.length === renderedPackets) {
                newPackets.shift();
            }
            const parsedMessage = JSON.parse(message.data);
            newPackets.push(parsedMessage);
            setLastReceivedPackage(parsedMessage);
            return newPackets;
        });
    }, [setPackets]);

    useEffect(() => {
        if (!ws) return;
        if (!mission) return;
        ws.send(JSON.stringify({ action: 'SET_MISSION', payload: mission }));
    }, [ws, mission]);

    useEffect(() => {
        if (ws) return;
        const newWs = new WebSocket('ws://localhost:1040');
        newWs.onerror = (error) => console.error('WS ERROR: ', error);
        newWs.onopen = () => {
            setWS(newWs);
        };
        newWs.onmessage = handleNewData;
    }, []);

    return <div className={'dashboard-container'}>
        <main className={'d-main'}>
            <Grid container>
                <Grid item xs={3.5}>
                    <div style={{ height: '90vh', display: 'grid', gridTemplate: '1fr 1fr 1fr / 100%', paddingTop: theme.spacing(1), padding: theme.spacing(3), gap: theme.spacing(3) }}>
                        <DashboardPanel>
                            <Typography variant='subtitle' style={{ fontWeight: 'bold'}}>
                                Temperatura
                            </Typography>
                            <Line
                                options={{
                                    responsive: true,
                                    animation: {
                                        duration: 300
                                    },
                                    scales: {
                                        x: {
                                            border: {
                                                display: false
                                            },
                                            grid: {
                                                display: false
                                            }
                                        },
                                        y: {
                                            callback: function(val, index) {
                                                // Hide every 2nd tick label
                                                return index % 2 === 0 ? this.getLabelForValue(val) : '';
                                            },
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                    }
                                }}
                                data={{
                                    labels: packets.map(p => p?.timestamp),
                                    datasets: [
                                        {
                                            label: 'temperature',
                                            fill: false,
                                            data: packets.map(p => p?.temperatura),
                                            borderColor: '#6979F8',
                                            tension: 0.4
                                        },
                                    ]
                                }}
                            />
                        </DashboardPanel>
                        <DashboardPanel>
                            <Typography variant='subtitle' style={{ fontWeight: 'bold'}}>
                                Aceleración
                            </Typography>
                            <Line
                                style={{ height: '100%' }}
                                options={{
                                    responsive: true,
                                    animation: {
                                        duration: 300
                                    },
                                    scales: {
                                        x: {
                                            border: {
                                                display: false
                                            },
                                            grid: {
                                                display: false
                                            }
                                        },
                                        y: {
                                            callback: function(val, index) {
                                                // Hide every 2nd tick label
                                                return index % 2 === 0 ? this.getLabelForValue(val) : '';
                                            },
                                        }
                                    },
                                }}
                                data={{
                                    labels: packets?.map(p => p?.timestamp),
                                    datasets: [
                                        {
                                            label: 'acx',
                                            fill: false,
                                            data: packets?.map(p => p?.acx),
                                            borderColor: '#6979F8',
                                            tension: 0.4
                                        },
                                        {
                                            label: 'acy',
                                            fill: false,
                                            data: packets?.map(p => p?.acy),
                                            borderColor: 'red',
                                            tension: 0.4
                                        },
                                        {
                                            label: 'acz',
                                            fill: false,
                                            data: packets?.map(p => p?.acz),
                                            borderColor: 'green',
                                            tension: 0.4
                                        },
                                    ]
                                }}
                            />
                        </DashboardPanel>
                        <DashboardPanel>
                            <Typography variant='subtitle' style={{ fontWeight: 'bold'}}>
                                Velocidad
                            </Typography>
                            <Line
                                options={{
                                    responsive: true,
                                    animation: {
                                        duration: 300
                                    },
                                    scales: {
                                        x: {
                                            border: {
                                                display: false
                                            },
                                            grid: {
                                                display: false
                                            }
                                        },
                                        y: {
                                            callback: function(val, index) {
                                                // Hide every 2nd tick label
                                                return index % 2 === 0 ? this.getLabelForValue(val) : '';
                                            },
                                        }
                                    }
                                }}
                                data={{
                                    labels: packets?.map(p => p?.timestamp),
                                    datasets: [
                                        {
                                            label: 'vx',
                                            fill: false,
                                            data: packets?.map(p => p?.vx),
                                            borderColor: '#6979F8',
                                            tension: 0.4
                                        },
                                        {
                                            label: 'vy',
                                            fill: false,
                                            data: packets?.map(p => p?.vy),
                                            borderColor: 'red',
                                            tension: 0.4
                                        },
                                        {
                                            label: 'vz',
                                            fill: false,
                                            data: packets?.map(p => p?.vz),
                                            borderColor: 'green',
                                            tension: 0.4
                                        }
                                    ]
                                }}
                            />
                        </DashboardPanel>
                    </div>
                    {/*<Grid container spacing={2}*/}
                    {/*    direction='column' justifyContent={'center'}*/}
                    {/*    style={{ height: '95vh', padding: theme.spacing(2), backgroundColor: 'red' }}*/}
                    {/*    flexWrap={'nowrap'}*/}
                    {/*>*/}
                    {/*    <Grid item xs={4}>*/}
                    {/*        */}
                    {/*    </Grid>*/}
                    {/*    <Grid item xs={4}>*/}

                    {/*    </Grid>*/}
                    {/*    <Grid item xs={4}>*/}
                    {/*        */}
                    {/*    </Grid>*/}
                    {/*</Grid>*/}
                </Grid>
                <Grid item xs={5}>
                    <Box p={2} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <DashboardPanel style={{ width: '50%' }}>
                            <Box px={5} style={{ width: '100%', backgroundColor: 'rgba(72, 69, 231, 0.16)', border: '1px solid #38405E', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <img src={'/svg/software_status.svg'} />
                                <Box p={0.5} textAlign={'center'}>
                                    Descending
                                </Box>
                            </Box>
                        </DashboardPanel>
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <Box px={1} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                            <img src={'/svg/parachute.svg'} />
                            <Typography variant={'caption'}>
                                Ascenso
                            </Typography>
                        </Box>
                        <img src={'/svg/arrow.svg'} />
                        <Box px={1} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                            <img src={'/svg/fire.svg'} />
                            <Typography variant={'caption'}>
                                Separación
                            </Typography>
                        </Box>
                        <img src={'/svg/arrow.svg'} />
                        <Box px={1} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                            <img src={'/svg/flag.svg'} />
                            <Typography variant={'caption'}>
                                Autogiro
                            </Typography>
                        </Box>
                        <img src={'/svg/arrow.svg'} />
                        <Box px={1} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                            <img src={'/svg/flag.svg'} />
                            <Typography variant={'caption'}>
                                Descenso
                            </Typography>
                        </Box>
                    </Box>
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} py={2}>
                        <Box textAlign={'center'}>
                            <Typography variant={'caption'}>
                                Ángulo Z
                            </Typography>
                            <Typography variant={'h5'} style={{ fontWeight: 'bold' }}>
                                {lastReceivedPackage?.orz}°
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
                                    {lastReceivedPackage?.orx}°
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={8}>
                            <Canvas style={{ height: '45vh' }}>
                                <ambientLight intensity={0.5} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                                <pointLight position={[-10, -10, -10]} />
                                {/* <Box3D position={[-1.2, 0, 0]} />
                                <Box3D position={[1.2, 0, 0]} /> */}
                                <PayloadModel 
                                    orx={lastReceivedPackage?.orx || 0} 
                                    ory={lastReceivedPackage?.ory || 0} 
                                    orz={lastReceivedPackage?.orz || 0}
                                    acz={lastReceivedPackage?.acx || 0}
                                    acx={lastReceivedPackage?.acy || 0}
                                    acy={lastReceivedPackage?.acz || 0}
                                />
                                <OrbitControls />
                            </Canvas>
                        </Grid>
                        <Grid item xs={2}>
                            <Box textAlign={'center'}>
                                <Typography variant={'caption'}>
                                    Ángulo Y
                                </Typography>
                                <Typography variant={'h5'} style={{ fontWeight: 'bold' }}>
                                    {lastReceivedPackage?.ory}°
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box textAlign={'center'} marginTop={theme.spacing(-3)}>
                        <Typography variant={'caption'}>
                            ...
                        </Typography>
                        {
                            [
                                { log: 'modo de descenso activado' },
                                { log: 'el sistema de autogiro se ha iniciado' },
                                { log: '250 metros alcanzados' },
                            ].map((packet, index) => 
                                <Typography variant={['body2', 'body1', 'h5'][index]} style={{ fontWeight: index > 2 ? 'bold' : 0 }}>
                                    {packet?.log}
                                </Typography>
                            )
                        }
                    </Box>
                </Grid>
                <Grid item xs={3.5}>
                    <div style={{ height: '90vh', display: 'grid', gridTemplate: '1fr 1fr 1fr / 100%', paddingTop: theme.spacing(1), padding: theme.spacing(3), gap: theme.spacing(3) }}>
                        <DashboardPanel style={{ textAlign: 'center' }}>
                            <Typography variant='subtitle' style={{ fontWeight: 'bold'}}>
                                Tiempo de la misión (minutos)
                            </Typography>
                            <Box py={3}>
                                <Typography variant={'h2'}>
                                    {Math.floor(lastReceivedPackage?.timestamp / 60) || 0}.{lastReceivedPackage?.timestamp % 60 || 0}
                                </Typography>
                            </Box>
                        </DashboardPanel>
                        <DashboardPanel>
                            <Typography variant='subtitle' style={{ fontWeight: 'bold'}}>
                                Altura
                            </Typography>
                            <Line
                                options={{
                                    responsive: true,
                                    animation: {
                                        duration: 300
                                    },
                                    scales: {
                                        x: {
                                            border: {
                                                display: false
                                            },
                                            grid: {
                                                display: false
                                            }
                                        },
                                        y: {
                                            callback: function(val, index) {
                                                // Hide every 2nd tick label
                                                return index % 2 === 0 ? this.getLabelForValue(val) : '';
                                            },
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                    }
                                }}
                                data={{
                                    labels: packets?.map(p => p?.timestamp),
                                    datasets: [
                                        {
                                            label: 'elevacion',
                                            fill: false,
                                            data: packets?.map(p => p?.elevacion),
                                            borderColor: '#6979F8',
                                            tension: 0.4
                                        }
                                    ]
                                }}
                            />
                        </DashboardPanel>
                        <DashboardPanel>
                            <Typography variant='subtitle' style={{ fontWeight: 'bold'}}>
                                Presión atmosferica
                            </Typography>
                            <Line
                                options={{
                                    responsive: true,
                                    animation: {
                                        duration: 300
                                    },
                                    scales: {
                                        x: {
                                            border: {
                                                display: false
                                            },
                                            grid: {
                                                display: false
                                            }
                                        },
                                        y: {
                                            callback: function(val, index) {
                                                // Hide every 2nd tick label
                                                return index % 2 === 0 ? this.getLabelForValue(val) : '';
                                            },
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                    }
                                }}
                                data={{
                                    labels: packets?.map(p => p?.timestamp),
                                    datasets: [
                                        {
                                            label: 'presion',
                                            fill: false,
                                            data: packets?.map(p => p?.presion),
                                            borderColor: '#6979F8',
                                            tension: 0.4
                                        }
                                    ]
                                }}
                            />
                        </DashboardPanel>
                    </div>
                </Grid>
            </Grid>
        </main>
        <DashboardFooter mission={mission}/>
    </div>
}