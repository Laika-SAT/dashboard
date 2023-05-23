import {Alert, Box, Button, CircularProgress, Grid, MenuItem, TextField} from "@mui/material";
import {TimePicker} from "@mui/x-date-pickers";
import React, {useState} from "react";
import electron from 'electron';
import moment from "moment";
const ipcRender = electron.ipcRenderer || false;

export default function MissionForm ({ onMissionStarted, onMissionCanceled }) {
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState(moment());
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
            .then((data) => onMissionStarted(data))
            .catch((e) => setError(e))
            .finally(() => setLoading(false));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleCreateMission();
    }

    return <form className={'create-mission-box'} onSubmit={handleFormSubmit}>
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
                    required
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
                    required
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
                <Box pb={1}>
                    <Button
                        type={'submit'}
                        variant={'contained'} color={'primary'}
                        fullWidth
                    >
                        { loading ? <CircularProgress /> : 'Iniciar Misión' }
                    </Button>
                </Box>
                <Button
                    variant={'outlined'} color={'primary'}
                    fullWidth onClick={onMissionCanceled}
                >
                    Cancelar
                </Button>
            </Grid>
        </Grid>
    </form>
}