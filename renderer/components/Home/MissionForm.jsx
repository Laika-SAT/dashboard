import {Alert, Box, Button, CircularProgress, Grid, MenuItem, TextField} from "@mui/material";
import {TimePicker} from "@mui/x-date-pickers";
import React, {useState} from "react";
import electron from 'electron';
const ipcRender = electron.ipcRenderer || false;

export default function MissionForm () {
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [mode, setMode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createMission = async () => {
        const result = await ipcRender.invoke('missions:create', JSON.stringify({
            name,
            mode,
            status: 'inactive',
            startDate: startTime,
        }));
        if (!result) throw new Error('Error while performing request');
        if (result.error) throw new Error(result.message);
        return result;
    };

    const handleCreateMission = () => {
        setLoading(true);
        setError(null);
        createMission()
            .then((data) => {
                console.log(data);
            })
            .catch((e) => setError(e))
            .finally(() => setLoading(false));
    };

    return <Box className={'create-mission-box'}>
        <Grid container spacing={3}>
            { Boolean(error) && <Alert severity={'error'}>{String(error)}</Alert> }
            <Grid item xs={12}>
                <TextField
                    value={name}
                    disabled={loading}
                    onChange={(e) => setName(e.target.value)}
                    variant={'outlined'}
                    color={'secondary'}
                    label={'Nombre de la misión'}
                    placeholder={'Introduce el nombre de la misión'}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6}>
                <TimePicker
                    label="Hora de inicio"
                    value={startTime}
                    disabled={loading}
                    onChange={(newValue) => setStartTime(newValue)}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    variant={'outlined'}
                    disabled={loading}
                    color={'secondary'}
                    label={'Modo'}
                    fullWidth
                >
                    <MenuItem value={'simulation'}>
                        Simulación
                    </MenuItem>
                    <MenuItem value={'live'}>
                        Live
                    </MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant={'contained'} color={'primary'}
                    fullWidth onClick={handleCreateMission}
                >
                    { loading ? <CircularProgress /> : 'Iniciar Misión' }
                </Button>
            </Grid>
        </Grid>
    </Box>
}