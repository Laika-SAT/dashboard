import {Button, Typography, Box, CircularProgress} from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { CSVLink } from 'react-csv';
import electron from 'electron';
const ipcRender = electron.ipcRenderer || false;

export default function DashboardFooter ({ mission }) {
    const [downloadLoading, setDownloadLoading] = useState(false),
        [tmpMetrics, setTmpMetrics] = useState([]),
        csvLink = useRef();

    const getMissionMetrics = useCallback(async () => {
        if (!mission) throw new Error('No mission where passed');
        const result = await ipcRender.invoke('missions:metrics', mission.id);
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

    return <footer className={'d-footer'}>
        <div className={'d-footer-secondary-menu'}>
            <Box display={'flex'} alignItems={'center'} height={'60px'} px={2} justifyContent={'space-between'}>
                <Box>
                    <Button variant={'contained'} color={'secondary'} style={{ width: '20vw' }}>
                        Iniciar Misión
                    </Button>
                </Box>
                <Box>
                    <Button variant={'contained'} color={'secondary'} onClick={handleDownloadFile}>
                        Descargar datos { downloadLoading && <CircularProgress /> }
                    </Button>
                    <CSVLink
                        data={tmpMetrics}
                        filename={`${mission?.name}-metrics.csv`}
                        className='hidden'
                        ref={csvLink}
                        target='_blank'
                    />
                </Box>
                
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
            </div>
        </div>
    </footer>;
}