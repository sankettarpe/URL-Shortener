import React from 'react'
import {createContext, useEffect, useState} from "react";

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const storedUser = localStorage.getItem('user');
        if(storedUser){
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const logout = () =>{
        localStorage.removeItem('user');
        setUser(null);
    }

  return (
    <AuthContext.Provider value = {{user, setUser, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider