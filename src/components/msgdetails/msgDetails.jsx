
import './msgDetails.css'
import ADDUSER from '../../images/add.png'
import REMUSER from '../../images/sub.png'
import USER from '../../images/user.png'
import INFO from '../../images/info.png'
import SOUT from '../../images/logout.webp'
import AddUserBox from '../addbox/addBox'
import { useState, useEffect, useContext } from 'react'
import { remUser } from './remUserFunction'
import { deleteGroupChat, deleteDmChat } from '../channelComp/deleteChannel'
import { useNavigate } from "react-router";
import { fetchData } from '../../hooks/updateList'
import axios from 'axios'
import { ChannelContext } from '../../context/channelConext'
import { UserContext } from '../../context/userContext'


const keys = ['_id', 'users', 'chatName', 'type', 'userIds', 'createdAt', 'updatedAt', '__v']

function MsgDetails({details, urls, gcUsers, test, type}){
    const [showBox, setShowBox] = useState(false)
    const [currUsers, setCurrUsers] = useState(gcUsers)
    const navigate = useNavigate()
    const {currentUser} = useContext(UserContext)
    const {dispatch} = useContext(ChannelContext)
    
    useEffect(() => {
        setCurrUsers(gcUsers)
        console.log("rerendering users")
    }, [urls, gcUsers])

    const updateUsers = async () => {
        const url = `http://localhost:3001/groupchat/getType/${details._id}/users`
        const list = await fetchData(url)
        console.log(list)
        setCurrUsers(list)
    }

    const toggleBox = () => {
        if(showBox){
            setShowBox(false)
        }else{
            setShowBox(true)
        }
    }
    const updateChatList = async () => {
        if(currentUser){
            const chatUrl = `http://localhost:3001/users/reqItem/${currentUser._id}/groupChats`
            const newList = await fetchData(chatUrl)
            dispatch({type:'setLinks', payload:newList})
        }
    }
    const updateDmList = async() => {
        if(currentUser){
            const dmUrl = `http://localhost:3001/users/reqItem/${currentUser._id}/dms`
            const newDmList = await fetchData(dmUrl)
            dispatch({type:'setDms', payload:newDmList})
        }
    }   
    const channelDelete = () => {
        if(currentUser.username === details.users[0]){
            const gcName = details.chatName
            deleteGroupChat(details._id, gcName)
            updateChatList()
            navigate('/channel/')
            updateChatList()
        }else{
            alert("you are not authorized")
        }
    }
    const dmDelete = () => {
        deleteDmChat(details._id, details.chatName)
        updateDmList()
        navigate('/dms/')
        updateDmList()
    }
    const isAdmin = () => {
        if(currentUser.username === details.users[0]){
            return true
        }else{
            return false
        }
    }   
    const leaveChat = async() => {
        await remUser(details._id, currentUser.username)
        updateChatList()
        navigate('/')
    }
    

    return(
        <div>
            <h3>Details</h3>
            {
                Object.keys(details).length > 0 ? (

            <div id="detailsWrapper">
                <div className='detContainer' style={{overflow:'visible'}}>
                    {
                        showBox 
                        ? (<AddUserBox update={toggleBox} chName={details.chatName} userLisFunc={test}></AddUserBox>) 
                        : (null)
                    }
                    {
                        type === "gc" ? (<img alt='' src={ADDUSER} id="adduser" onClick={toggleBox}></img>) 
                        : (null)
                    }
                    {
                        type === "gc" ? (<img alt='' src={REMUSER} id="adduser" onClick={channelDelete}></img>) 
                        : (<img alt='' src={REMUSER} id="adduser" onClick={dmDelete}></img>)   
                    }
                    {
                        type === "gc" ? (<img alt='' src={SOUT} id="adduser" onClick={leaveChat}></img>) 
                        : (null)    
                    }
                    
                </div>
                
                <h4>About</h4>
                <div className='detContainer' style={{display:"flex"}}>
                    <img alt='' src={INFO} style={{height:90, width:90, zIndex:4, position:"relative"}}></img>
                    <p>{details.desc}</p>
                </div>
                <div className='detContainer' style={{display:"flex"}} draggable={true}>   
                    <img alt='' src={USER} style={{height:90, width:90}}></img>
                    <div>
                        { // orignal = details.users
                         details.users.map((item, idx) => {
                            return(
                                <User  key={idx} 
                                    linkId={details._id} 
                                    newUserName={item}//item 
                                    updateFunc={test}
                                    isAdmin={isAdmin}></User>
                            )})
                        }
                        {
                            //details.userIds.map((item, idx) => {return(<p key={idx}>{item}</p>)})
                        }
                    </div>
                </div>
                <div className='detContainer'>   
                    <h4>Chat Name</h4>
                    <p>{details.chatName}</p>
                </div>
            </div>
            ) : (<h1>Loading...</h1>)
            }
        </div>
    )
}

function User({linkId, newUserName, updateFunc, isAdmin}){
    //console.log(linkId, newUserName, newUserId)
    const removeUser = async () => {
        await remUser(linkId, newUserName)
        updateFunc()
    }   
    return(
        <div style={{display:"flex"}}>
            <p>{newUserName}</p>
            {//<img alt='' id="remUserBtn" src={REMUSER} onClick={removeUser}></img> 

                isAdmin() ? (<img alt='' id="remUserBtn" src={REMUSER} onClick={removeUser}></img>): (null)
            }
            
        </div>
    )
}
export default MsgDetails;