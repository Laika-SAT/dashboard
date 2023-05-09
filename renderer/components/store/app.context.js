import { createContext } from "react";

const AppContext = createContext({
    loading: false,
    mission: null,
    ws: null,
});

export default AppContext;