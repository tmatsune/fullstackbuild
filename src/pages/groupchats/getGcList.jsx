import './getGcList.css'
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../context/userContext'
import { Link } from 'react-router-dom'
import axios from "axios"
import {ChannelContext} from "../../context/channelConext"
import { fetchData } from '../../hooks/updateList'

function GetGcLinks({links}){
    const {currentUser} = useContext(UserContext)
    const {groupChatLinks} = useContext(ChannelContext)
    const [loading, setLoading] = useState(false)
    const [testLinks, SetTestLinks] = useState([])

    useEffect(() => {
        const url = `http://localhost:3001/users/reqItem/${currentUser._id}/groupChats`
        const fetchData = async() => {  
            try{
                const data = await axios.get(url)
                //SetTestLinks(data.data)
            }catch(err){
                console.log(err)
            }
        }
        //fetchData()
    }, [])
    

    return(
        <div className='linkDiv'>
            {
                groupChatLinks.map((item, idx) => {          //testLinks
                    return(
                        <ChatRedirect chatLink={item}key={idx} ></ChatRedirect>
                    )
                })
            }
        </div>
    )
} 
function ChatRedirect({chatLink}){
    const url = `${chatLink}`
    const {dispatch} = useContext(ChannelContext)

    const testChat = async() => {
        const urls = `http://localhost:3001/groupchat/getGroupchat/${chatLink}`
        const pramams = {
            nameChat : chatLink
        }
        try{
            const data = await axios.get(urls, pramams)
            //console.log(data.data)
            dispatch({type:"getChannel", payload:data.data})
        }catch(err){
            console.log(err)
        }
    }
    return(
        <li id="chLink">
        <Link to={`/channel/${url}`}  id="chLink">
            #{chatLink}
        </Link>
        </li>
    )
}
export default GetGcLinks
/*
function ChatRedirect({chatLink}){
    const url = `${chatLink._id}`
    const {dispatch} = useContext(ChannelContext)

    const testChat = async() => {
        const urls = `http://localhost:3001/groupchat/getGroupchat/${chatLink._id}`
        try{
            const data = await axios.get(urls)
            console.log(data.data)
            dispatch({type:"getChannel", payload:data.data})
        }catch(err){
            console.log(err)
        }
    }
    return(
        <li id="chLink">
        <Link to={`/channel/${url}`} onClick={testChat} id="chLink">
            #{chatLink.chatName}
        </Link>
        </li>
    )
}
*/