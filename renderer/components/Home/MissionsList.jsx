import React, {useEffect, useState, useCallback} from 'react';
import moment from "moment/moment";
import {CardActionArea, List, ListItem, Pagination, Modal, Typography, Box, Stack, TextField, IconButton, Button, Grid} from "@mui/material";
import Mission from "./Mission";
import electron from 'electron';
const ipcRender = electron.ipcRenderer || false;
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';


export default function MissionsList ({ onMissionClicked, onNewMission }) {
    const [data, setData] = useState([]),
        [query, setQuery] = useState(''),
        [ord, setOrd] = useState('id'),
        [asc, setAsc] = useState(false),
        [pag, setPag] = useState(1),
        [num, setNum] = useState(6),
        [loading, setLoading] = useState(false),
        [error, setError] = useState(null),
        [tmpDeleteItem, setTmpDeleteItem] = useState(null);

    const listData = useCallback(async () => {
        const result = await ipcRender.invoke('missions:list', JSON.stringify({
            filter: {
                query: query || undefined
            },
            options: {
                ord, asc, pag: pag - 1, num,
            }
        }));
        if (!result) throw new Error('Error while performing request');
        if (result.error) throw new Error(result.message);
        return result;
    }, [ord, asc, pag, num, query]);

    const handleRequestData = () => {
        setLoading(true);
        setError(null);
        listData()
            .then((result) => setData(result))
            .catch((e) => setError(e))
            .finally(() => setLoading(false));
    };

    const handleOpenDeleteWindow = (data) => {
        setTmpDeleteItem(data);
    };
    
    const handleAbortDelete = () => {
        setTmpDeleteItem(null);
    };

    const deleteMission = useCallback(async () => {
        const result = await ipcRender.invoke('missions:delete', tmpDeleteItem?.id);
        if (!result) throw new Error('Error while performing request');
        if (result.error) throw new Error(result.message);
        return result;
    }, [tmpDeleteItem]);

    const handleDeleteMission = () => {
        deleteMission()
            .then(() => {
                setTmpDeleteItem(null);
                handleRequestData()
            })
            .catch((error) => setError(error));
    };

    useEffect(() => {
        handleRequestData();
    }, [pag, query]);

    return <>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', pb: 2 }}>
            <TextField
                placeholder={'Busca una misión por nombre'}
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                fullWidth
                InputProps={{
                    classes: {
                        root: 'mission-search-box'
                    },
                    startAdornment: <IconButton>
                        <SearchIcon />
                    </IconButton>
                }}
            />
            <Box display={'flex'} justifyContent={'flex-end'} pl={3}>
                <Button 
                    variant={'contained'} color={'primary'} 
                    style={{ whiteSpace: 'nowrap', borderRadius: '50px' }}
                    onClick={onNewMission}
                >
                    Nueva misión
                </Button>
            </Box>
        </Box>
        {loading && <Typography>Cargando...</Typography>}
        {
            (!loading && data?.data?.length > 0) && <List>
                {
                    data.data.map((item, index) => (
                        <ListItem key={index} sx={{padding: 0, marginBottom: '5px' }}>
                            <Mission 
                                data={item}
                                onRestore={() => onMissionClicked(item)}
                                onDelete={() => handleOpenDeleteWindow(item)}
                            />
                        </ListItem>
                    ))
                }
            </List>
        }
        {
            data?.data?.length > 0 && <Stack direction={'row'} justifyContent={'flex-end'}>
                <Pagination
                    color={'primary'}
                    count={Math.ceil(data?.totalCount / num)}
                    page={pag} 
                    onChange={(_, newValue) => setPag(newValue)}
                />
            </Stack>
        }
        <Modal
            open={Boolean(tmpDeleteItem)}
            onClose={handleAbortDelete}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 350,
                bgcolor: '#222',
                boxShadow: 24,
                p: 2,
                borderRadius: '8px'
            }}>
                <Typography variant={'h6'} gutterBottom>
                    ¿Desea eliminar esta misión?
                </Typography>
                <Typography>
                    {tmpDeleteItem?.name}
                </Typography>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    pt: 2
                }}>
                    <Box pr={1}>
                        <Button variant={'outlined'} onClick={handleAbortDelete}>
                            Cancelar
                        </Button>
                    </Box>
                    <Button variant={'contained'} onClick={handleDeleteMission}>
                        Confirmar
                    </Button>
                </Box>
            </Box>
        </Modal>
    </>;
}