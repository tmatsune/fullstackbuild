
import './createChatBox.css'
import axios from 'axios'
import { useContext, createContext, useState } from 'react'
import { UserContext } from '../../context/userContext'
import SUB from '../../images/sub.png'
import SEARCH from '../../images/search.png'
import { ChannelContext } from '../../context/channelConext'
import { fetchData } from '../../hooks/updateList'


function CreateAddBox({update}){
    const {currentUser} = useContext(UserContext)
    const [display, setDisplay] = useState(false)
    const [flip, setFlip] = useState('add chat')

    const toggleShow = () => {
        if(display){
            setDisplay(false)
            setFlip('add chat')
        }else{
            setDisplay(true)
            setFlip('create chat')
        }
    }

    return(
        <div id='addGroupChat'>
            <img alt='' id="min" src={SUB} onClick={() => update(1)}></img>
            <span onClick={toggleShow} id="toggle">{flip}</span>
            {
                display ? 
                    (<AddChat currentUser={currentUser}></AddChat>)
                : (<CreateChat currentUser={currentUser}></CreateChat>)
            }

        </div>

    )
}
function CreateChat({currentUser}){
    const createUrl = "http://localhost:3001/groupchat/create"
    const [newChat, setNewChat] = useState("")
    const [desc, setDesc] = useState("")
    const {dispatch} = useContext(ChannelContext)  

    const createNewChat = async() => {
        if(currentUser){
            try{
            const inputHandler = {
                userId: currentUser._id,
                chatName: newChat,
                username:currentUser.username,
                descript: desc
            }  
            const data = await axios.post(createUrl, inputHandler)
            //console.log(data.data)
            updateChatList()
            setNewChat('')
            setDesc('')
            }catch(err){
                if(err.code === 'ERR_BAD_RESPONSE'){
                    alert("chatname already used, try another")
                }else{
                    alert("error")
                }
            }

        }else{
            alert("could not create chat")
            console.log("could not create new chat")
        }
    }
    const updateChatList = async () => {
        if(currentUser){
            const chatUrl = `http://localhost:3001/users/reqItem/${currentUser._id}/groupChats`
            const newList = await fetchData(chatUrl)
            dispatch({type:'setLinks', payload:newList})
        }
    }
    return(
        <div>
            <h3>Create Group Chat</h3>
            <form>
                <div>
                <input value={newChat} onChange={e => setNewChat(e.target.value)} 
                    placeholder='enter chat'
                    className="chatInput">
                </input>
                </div>
                <div>
                <input value={desc} onChange={e => setDesc(e.target.value)} 
                    maxLength={80}
                    placeholder='enter desc'
                    className="chatInput">
                </input>
                </div>
            </form>
            <span onClick={createNewChat} id="toggle1">Submit</span>
        </div>
    )
}
function AddChat({currentUser}){
    const addChatUrl = "http://localhost:3001/groupchat/addUser"
    const [exisChat, setExisChat] = useState('')
    const [search, setSearch] = useState('')
    const {dispatch} = useContext(ChannelContext)

    const updateChatList = async () => {
        if(currentUser){
            const chatUrl = `http://localhost:3001/users/reqItem/${currentUser._id}/groupChats`
            const newList = await fetchData(chatUrl)
            dispatch({type:'setLinks', payload:newList})
        }
    }

    const addExistingChat = async() => {
        try{
            const inputHandler = {
                userId: currentUser._id,
                username:currentUser.username, 
                chatName: exisChat,
            }
            const data = await axios.put(addChatUrl, inputHandler)
            updateChatList()
            console.log("chat added")
            setExisChat('')
        }catch(err){
            alert("could not find chat")
            console.log(err)
        }
    }
    const findChat = async() => {
        const url = `http://localhost:3001/groupchat/getGroupchats/${exisChat}`
        try{
            const data = await axios.get(url)
            if(data.data){
                setSearch(data.data)
            }else{
                setSearch('chat not found')
            }
        }catch(err){
            console.log(err)
        }
    }

    return(
        <div>
            <h3>Find GroupChat</h3>
            <div style={{marginTop: 20, display:"flex"}}>
                <input value={exisChat} 
                onChange={e => setExisChat(e.target.value)} 
                placeholder='enter chat name'
                className="chatInput"
                >
                </input>
                <img alt='' src={SEARCH} id="search" onClick={findChat}></img>
            </div>
            {
                search === 'chat not found' ? (<p>not found</p>) : 
                (<DisplayChatSnapShot details={search} addFunc={addExistingChat}></DisplayChatSnapShot>)
            }
        </div>
    )
}
function DisplayChatSnapShot({details, addFunc}){
    const [show, setShow] = useState(false)
    const toggle = () => {
        if(show){
            setShow(false)
        }else{
            setShow(true)
        }
    }
    const addChat = () => {
        addFunc()
    }
    return(
        <div>
            <h3>{details.chatName}</h3>
            {
                details ? (<span onClick={toggle} id="showUsers">Users in Chat</span>) : (null)
            }
            {
                show ? (
                    details.users.map((item, idx) => {
                        return(
                            <p key={idx}>{item}</p>
                        )
                    })
                ) : (null)
            }
            {
                details ? (<span onClick={addChat} id="addBtn">Add Chat</span>) : (null)
            }
        </div>
    )
}
export default CreateAddBox