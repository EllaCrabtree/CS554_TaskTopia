/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import {auth} from './Firebase';

export const AuthContext = React.createContext(null);

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect (() => {
        auth.onAuthStateChanged (setCurrentUser)
    }, [])

    return <AuthContext.Provider value={{currentUser}}>{children}</AuthContext.Provider>

};