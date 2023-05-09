import {Box, CircularProgress, Grid, LinearProgress, Typography} from "@mui/material";
import {useState, useEffect} from "react";

const useLoadingPoints = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const addDotsInterval = setInterval(() => {
            setDots(prev => prev.length === 3 ? '' : prev + '.');
        }, 700);
        return () => {
            clearTimeout(addDotsInterval);
        };
    }, []);

    return dots;
}

export default function Loading () {
    const loadingPoints = useLoadingPoints();

    return <div className={'centered-container'}>
        <div>
            <Grid container direction={'column'} alignItems={'center'} spacing={2}>
                <Grid item xs={12}>
                    <img style={{ width: '200px', height: '200px' }} src={'/icons/logo.svg'}/>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={'h3'} textTransform={'capitalize'}>LAIKA SAT</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={'body1'}>
                        cargando{loadingPoints}
                    </Typography>
                </Grid>
            </Grid>
        </div>
    </div>
}