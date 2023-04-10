import Theme from '../components/App/Theme';
import {CssBaseline, GlobalStyles, ThemeProvider} from '@mui/material';
import Template from "../components/App/Template";
import "../components/App/styles.css";
import "../styles/home.css";
import AppContext from "../components/store/app.context";
import {useEffect, useState} from "react";
import Loading from "../components/App/Loading";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

export default function App({ Component, pageProps }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tm = setTimeout(() => {
            setLoading(false);
        }, 4000);

        return () => {
            clearTimeout(tm);
        };
    }, []);

    return <div>
        <AppContext.Provider value={{loading, setLoading}}>
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