import { createContext, useEffect, useState } from "react";
import { getUserApi } from "../configs/api";

export const AppContext = createContext();

export default function AppProvider({children}) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState();
    
    async function getUser() {
        if(token){
            const user = await getUserApi();
            setUser(user.data);
        }
    }
    useEffect((token) => {getUser(token)}, [token])

    return (
        <AppContext.Provider value={{token, setToken, user, setUser}}>
            {children}
        </AppContext.Provider>
    )
}