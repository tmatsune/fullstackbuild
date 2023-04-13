import { createContext, useReducer, useEffect } from "react"

const INITIALSTATE = {
    channelInfo: {},
    groupChatLinks: [],
    dmLinks: []
}
const channelReducer = (state, action) => {

    switch(action.type){
        case "getChannel":
            return {...state, channelInfo: action.payload}
        case "setLinks":
            return {...state, groupChatLinks: action.payload}
        case "setDms":
            return {...state, dmLinks: action.payload}
        default:
            return state
    }
}
export const ChannelContext = createContext(INITIALSTATE)

export const ChannelProvider = ({children}) => {
    const [state, dispatch] = useReducer(channelReducer, INITIALSTATE)

    const {channelInfo, groupChatLinks, dmLinks} = state
    const value = {channelInfo, dispatch, groupChatLinks, dmLinks}
    
    useEffect(() => {
        const data = localStorage.getItem("currChannel")
        if(data !== "{}"){
            console.log("setting channel")
            //dispatch({type:"getChannel", payload:JSON.parse(data)})
        }
    }, [])
    useEffect(() => {
        localStorage.setItem("currChannel", JSON.stringify(channelInfo))
    })

    return <ChannelContext.Provider value={value}>
            {children}
            </ChannelContext.Provider>
}

