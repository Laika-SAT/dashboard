import React, {useEffect, useState} from 'react';
import moment from "moment/moment";
import {CardActionArea, List, ListItem, Typography} from "@mui/material";
import Mission from "./Mission";
import electron from 'electron';
const ipcRender = electron.ipcRenderer || false;

export default function MissionsList ({ onMissionClicked }) {
    const [data, setData] = useState([]),
        [ord, setOrd] = useState('id'),
        [asc, setAsc] = useState(false),
        [pag, setPag] = useState(0),
        [loading, setLoading] = useState(false),
        [error, setError] = useState(null);

    const listData = async () => {
        const result = await ipcRender.invoke('missions:list', JSON.stringify({
            filter: {},
            options: {
                ord, asc, pag, num: 4
            }
        }));
        if (!result) throw new Error('Error while performing request');
        if (result.error) throw new Error(result.message);
        return result;
    };

    const handleRequestData = () => {
        setLoading(true);
        setError(null);
        listData()
            .then((result) => setData(result))
            .catch((e) => setError(e))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        handleRequestData();
    }, []);

    return (
        <List>
            {loading && <Typography>Cargando...</Typography>}
            {
                (!loading && data?.data?.length) && data.data.map((data, index) => (
                    <ListItem key={index} sx={{padding: 0, marginBottom: '5px' }} onClick={() => onMissionClicked(data)}>
                        <Mission data={data}/>
                    </ListItem>
                ))
            }
        </List>
    );
}