
import './msgDetails.css'
import ADDUSER from '../../images/add.png'
import REMUSER from '../../images/sub.png'
import USER from '../../images/user.png'
import INFO from '../../images/info.png'
import AddUserBox from '../addbox/addBox'
import { useState, useEffect } from 'react'
import { remUser } from './remUserFunction'
import { deleteGroupChat } from '../channelComp/deleteChannel'
import { useNavigate } from "react-router";
import { fetchData } from '../../hooks/updateList'
import axios from 'axios'

const keys = ['_id', 'users', 'chatName', 'type', 'userIds', 'createdAt', 'updatedAt', '__v']

function MsgDetails({details, urls, gcUsers, test}){
    const [showBox, setShowBox] = useState(false)
    const [currUsers, setCurrUsers] = useState(gcUsers)
    const navigate = useNavigate()
    
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
    const channelDelete = () => {
        deleteGroupChat(details._id)
        navigate('/')
    }
    //------------ test ----------//
    const addUserUrl = 'http://localhost:3001/groupchat/addUser'

    const addUserToChat = async() => {
        const addedUserHandler = {
            username: "barry",
            chatName: details.chatName
        }
        try{
            const data = await axios.put(addUserUrl, addedUserHandler)
            console.log(data)
            test()
        }catch(err){
            alert("could not add user to chat")
            console.log(err)
        }
    }
    //------------ test ----------//

    return(
        <div>
            <h3>Details</h3>
            {
                details.users.map((user, idx) => {
                    return(
                        <p key={idx}>{user}</p>
                    )
                })
            }
            <button onClick={addUserToChat}>test btn</button>
            {
                Object.keys(details).length > 0 ? (

            <div id="detailsWrapper">
                <div className='detContainer' style={{overflow:'visible'}}>
                    {
                        showBox 
                        ? (<AddUserBox update={toggleBox} chName={details.chatName} userLisFunc={updateUsers}></AddUserBox>) 
                        : (null)
                    }
                    <img alt='' src={ADDUSER} id="adduser" onClick={toggleBox}></img>
                    <img alt='' src={REMUSER} id="adduser" onClick={channelDelete}></img>
                </div>
                
                <h4>About</h4>
                <div className='detContainer' style={{display:"flex"}}>
                    <img alt='' src={INFO} style={{height:90, width:90, zIndex:4, position:"relative"}}></img>
                    <p>{details.createdAt}</p>
                </div>
                <div className='detContainer' style={{display:"flex"}} draggable={true}>   
                    <img alt='' src={USER} style={{height:90, width:90}}></img>
                    <div>
                        { // orignal = details.users
                         currUsers.map((item, idx) => {
                            return(
                                <User  key={idx} 
                                    linkId={details._id} 
                                    newUserName={item}//item 
                                    updateFunc={updateUsers}></User>
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

function User({linkId, newUserName, updateFunc}){
    //console.log(linkId, newUserName, newUserId)
    const removeUser = async () => {
        await remUser(linkId, newUserName)
        updateFunc()
    }   
    return(
        <div style={{display:"flex"}}>
            <p>{newUserName}</p>
            <img alt='' id="remUserBtn" src={REMUSER} onClick={removeUser}></img>
        </div>
    )
}
export default MsgDetails;

background: linear-gradient(90deg, rgb(154, 52, 255), rgb(142, 89, 255));
// light bg 
background: linear-gradient(90deg, rgb(122, 71, 251), rgb(99, 104, 252));
//dark bg
background: linear-gradient(90deg, rgb(31, 31, 31), rgb(24, 24, 24));


    const sendMsg =  async() => {
        const messageState = {
            chatNameId: pathId.replace('%20',' '),
            sender: currentUser.username,
            text: newText,
        }
        const messageState2 = {
            chatNameId: pathId,
            sender: currentUser.username,
            text: newText,
            createdAt: new Date()
        }
        try{
            const sendImg = ''
            //const sentMsg = await axios.post(sendUrl, messageState)
            //console.log(sentMsg)
            const gcName = pathId.replace(/%20/g,' ')
            addToChat(newText, gcName, sendImg, currentUser.username)
            //await socket.emit("sendMessage", messageState2)
            console.log("message sent")
            setNewText('')
        }catch(err){ 
            console.log(err)
        }
    }