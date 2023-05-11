import Theme from '../components/App/Theme';
import {CssBaseline, ThemeProvider} from '@mui/material';
import AppContext from "../components/store/app.context";
import {useEffect, useState} from "react";
import Loading from "../components/App/Loading";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import electron from 'electron';
const ipcRender = electron.ipcRenderer || false;
import WebSocket from 'ws';

import "../components/App/styles.css";
import "../styles/home.css";
import "../styles/dashboard.css";

export default function App({ Component, pageProps }) {
    const [loading, setLoading] = useState(true),
        [mission, setMission] = useState(null);

    useEffect(() => {
        const tm = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => {
            clearTimeout(tm);
        };
    }, []);

    return <div>
        <AppContext.Provider value={{
            loading, setLoading, mission, setMission
        }}>
            <ThemeProvider theme={Theme}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <CssBaseline>
                        {
                            loading
                                ? <Loading/>
                                : <Component {...pageProps} />
                        }
                    </CssBaseline>
                </LocalizationProvider>
            </ThemeProvider>
        </AppContext.Provider>
    </div>
};