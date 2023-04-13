
import { createContext, useReducer, useEffect } from "react";

const INITIALCOLOR = {
    dark: true
}
const colorReducer = (state, action) => {
    switch(action.type){
        case "setDark":
            return {...state, dark: action.payload}
        default:
            return state
    }
}

export const DarkContext = createContext(INITIALCOLOR)

export const DarkProvider = ({children}) => {
    const [state, dispatch] = useReducer(colorReducer, INITIALCOLOR);

    const {dark} = state;
    
    useEffect(() => {
        const data = localStorage.getItem("dark")
        if(data){
            dispatch( { type:"setDark", payload:JSON.parse(data) } )
        }
    }, [])
    useEffect(() => {
        localStorage.setItem("dark", JSON.stringify(dark))
    })

    const value = {dark, dispatch};

    return <DarkContext.Provider value={value}>{children}</DarkContext.Provider>
}

