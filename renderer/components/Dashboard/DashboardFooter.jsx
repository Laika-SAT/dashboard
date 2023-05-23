import {Button, Typography, Box, CircularProgress, Stack, IconButton, styled} from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { CSVLink } from 'react-csv';
import electron from 'electron';
const ipcRender = electron.ipcRenderer || false;
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import HomeIcon from '@mui/icons-material/Home';
import TerminalIcon from '@mui/icons-material/Terminal';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import { useRouter } from "next/router";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: '#2C2F75',
    color: '#fff',
    border: '1px solid #7D82F5',
}));

export default function DashboardFooter ({ recording, mission, onFinish, onFinishRecording, onStartRecording }) {
    const [downloadLoading, setDownloadLoading] = useState(false),
        [tmpMetrics, setTmpMetrics] = useState([]),
        csvLink = useRef(),
        router = useRouter();

    const getMissionMetrics = useCallback(async () => {
        if (!mission) throw new Error('No mission where passed');
        const result = await ipcRender.invoke('metrics:csv', mission.id);
        if (!result) throw new Error('Error while performing request');
        if (result.error) throw new Error(result.message);
        return result;
    }, [mission]);

    const handleDownloadFile = async () => {
        setDownloadLoading(true);
        getMissionMetrics()
            .then((data) => {
                setTmpMetrics(data);
                setTimeout(() => {
                    csvLink.current.link.click();
                }, 0);
            })
            .catch((e) => console.error(e))
            .finally(() => setDownloadLoading(false));
    };

    const handleRouting = (path) => router.push(path);

    return <footer className={'d-footer'}>
        <div className={'d-footer-secondary-menu'}>
            <Box display={'flex'} alignItems={'center'} height={'60px'} px={2} justifyContent={'space-between'}>
                <StyledIconButton onClick={() => handleRouting('/')} disabled={recording}>
                    <HomeIcon />
                </StyledIconButton>
                <StyledIconButton>
                    <TerminalIcon />
                </StyledIconButton>
                <StyledIconButton>
                    <LooksTwoIcon />
                </StyledIconButton>
                <Button 
                    variant={'contained'} 
                    color={'secondary'} 
                    onClick={handleDownloadFile}
                    startIcon={<DownloadIcon />}
                >
                    Descargar datos { downloadLoading && <CircularProgress /> }
                </Button>
                <CSVLink
                    data={tmpMetrics}
                    filename={`${mission?.name}-metrics.csv`}
                    className='hidden'
                    ref={csvLink}
                    target='_blank'
                />
                {/* {
                    (mission?.mode === 'simulation' && !recording) && ( */}
                        <Button 
                            variant={'contained'} 
                            color={'secondary'} 
                            onClick={handleDownloadFile}
                            startIcon={<FileUploadIcon />}
                        >
                            Subir datos { downloadLoading && <CircularProgress /> }
                        </Button>
                    {/* )
                } */}
                {/* <Button variant={'contained'} color={'secondary'} onClick={handleDownloadFile}>
                    Borrar datos { downloadLoading && <CircularProgress /> }
                </Button> */}
            </Box>
        </div>
        <div className={'d-footer-primary-menu'}>
            <div className={'left-side'}>
                <div className={'logo-container'}>
                    <img src={'/icons/logo.svg'} />
                </div>
                <div className={'d-footer-title'}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        LAIKA SAT
                    </Typography>
                </div>
            </div>
            <div className={'right-side'}>
                {
                    recording && <Button variant={'contained'} color={'error'} onClick={onFinishRecording}>
                        Terminar captura de datos
                    </Button>
                }
                {
                    !recording && <Stack direction={'row'}>
                        <Box pr={2}>
                            <Button variant={'contained'} color={'success'} onClick={onStartRecording}>
                                Iniciar captura de datos
                            </Button>
                        </Box>
                        <Button variant={'contained'} color={'error'} onClick={onFinish}>
                            Salir
                        </Button>
                    </Stack>
                }
            </div>
        </div>
    </footer>;
}