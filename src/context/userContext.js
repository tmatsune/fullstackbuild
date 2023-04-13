
import { createContext, useReducer, useEffect } from "react";

const INITIAL_STATE = {
    currentUser: null,
    profileImg: null,
}
const userReducer = (state, action) => {
    switch(action.type){
        case "login":
            return {...state, currentUser: action.payload}
        case "logout":
            return {currentUser: null}
        case "changeProf":
            return {...state, profileImg: action.payload} 
        default:
            return state
    }
}
export const UserContext = createContext(INITIAL_STATE)

export const UserProvider = ({children}) => {
    const [state, dispatchUser] = useReducer(userReducer, INITIAL_STATE)

    const {currentUser, profileImg} = state
    
    useEffect(() => {
        const data = localStorage.getItem("currentUser")
        if(data !== 'null'){
            dispatchUser({type:"login", payload:JSON.parse(data)})
        }
    }, [])

    useEffect(() => { 
        localStorage.setItem("currentUser", JSON.stringify(currentUser)) 
    }, ) 
 
    const value = {currentUser, dispatchUser, profileImg}
    
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}