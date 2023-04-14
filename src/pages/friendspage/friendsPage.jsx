import './friendsPage.css'
import { UserContext } from '../../context/userContext'
import { useContext, useEffect } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router'
import { useState } from 'react'
import { fetchData } from '../../hooks/updateList'
import ADD from '../../images/email.png'
import REM from '../../images/sub.png'
import { ChannelContext } from '../../context/channelConext'
import { useNavigate } from "react-router-dom";
import { createGroupChat } from '../../utils/firebase'

function FriendsPage(){
    const location = useLocation();
    const pathId = location.pathname.split('/')[2]
    const [friends, setFriends] = useState([])
    const {currentUser} = useContext(UserContext)
    const navigate = useNavigate();

    const getFriends = async() => {
        const chatUrl = `http://localhost:3001/users/reqItem/${pathId}/friends`
        const newList = await fetchData(chatUrl)
        //console.log(newList)
        setFriends(newList)
    }

    useEffect(() => {
        getFriends()
    }, [pathId])

    useEffect(() => {
        if(currentUser){
            console.log("here")
            if(pathId !== currentUser._id){
                console.log("navigate")
                navigate("/");
            }
        }
    }, [currentUser])
    
    return(
        <div id="frMain">
            <div id="frCard">
            <div id="inCard">
              <h1>Friends</h1>
              <hr></hr>
                <div>
                {
                    currentUser ? (
                    friends.map((item, idx) => {
                        return(
                            <FriendItem key={idx} 
                                name={item} 
                                userId={pathId}
                                currUserName={currentUser.username}
                                update={getFriends}>
                            </FriendItem>
                        )
                    })
                    ) : (null)
                }


                </div>
              </div>
              </div>
              
        </div>
    )
}
function FriendItem({name, currUserName, userId, update}){
    const createUrl = "http://localhost:3001/dms/createDm"
    const {dispatch} = useContext(ChannelContext)
    
    const updateDmList = async() => {
        if(userId){
            const dmUrl = `http://localhost:3001/users/reqItem/${userId}/dms`
            const newDmList = await fetchData(dmUrl)
            dispatch({type:'setDms', payload:newDmList})
        }
    }  
    
    const createMessage = async() => {
        const dmhandler = {
            userName: currUserName,
            recUserName: name,
            userId: userId
        }
        try{
            const data = await axios.post(createUrl, dmhandler)
            await createGroupChat(data.data.chatName) //////firebase
            console.log(data)
            updateDmList()
        }catch(err){
            console.log(err)
        }

    }
    const removeFriend = async() => {
        const url =`http://localhost:3001/users/removeFriend/${userId}/${name}`
        try{
            const data = await axios.put(url)
            console.log(data)
            update()
        }catch(err){
            console.log(err)
        }
    }
    return(
        <div style={{display: 'flex'}}>
            <h3>{name}</h3>
            <img alt='' id="email" src={ADD} onClick={createMessage}></img>
            <img alt='' id='remFri' src={REM} onClick={removeFriend}></img>
        </div>
    )
}

export default FriendsPage