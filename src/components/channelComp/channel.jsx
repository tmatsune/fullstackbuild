import './channel.css'
import { useLocation } from 'react-router'
import axios from 'axios'
import { useState, useEffect, useContext, useRef } from 'react'
import {UserContext} from '../../context/userContext'
import MsgDetails from '../msgdetails/msgDetails'
import {io} from "socket.io-client"
import { ChannelContext } from '../../context/channelConext'
import { fetchData } from '../../hooks/updateList'
import HashLoader from "react-spinners/HashLoader";
import LoaderComp from '../../components/loader/loaderComp'
import SEND from '../../images/send.png'
import { useNavigate } from "react-router-dom";
import { getImage, uploadImage, addToChat, db } from '../../utils/firebase'
import { doc, onSnapshot } from 'firebase/firestore'

function Channel(){
    const location = useLocation()
    const {currentUser} = useContext(UserContext)
    const pathId = location.pathname.split("/")[2]
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newText, setNewText] = useState('')
    const [newMessage, setNewMessage] = useState(null)  
    const [socket, setSocket] = useState(null)
    const [channelInfo, setChannelInfo] = useState({})
    const scrollDiv = useRef(null)
    const navigate = useNavigate();
    const [imageUpload, setImageUpload] = useState(null)
    const [imgLoading, setImgLoading] = useState(false)

    useEffect(() => {
        if(currentUser && Object.keys(channelInfo).length > 0){
            if(!channelInfo.users.includes(currentUser.username)){
                console.log("user not authorized")
                navigate("/");
            }else{
                console.log("user authenticated")
            }
        }
    }, [currentUser, channelInfo])
    
    const updateUsers2 = async () => {
        const url = `http://localhost:3001/groupchat/getType/${channelInfo._id}/users`
        const list = await fetchData(url)
        //console.log(list)
        setChannelInfo({...channelInfo, users: list})
    }

    const url = `http://localhost:3001/message/getmessagess/${pathId}`
    const testChat = async() => {
        setLoading(true) 
        try{
            const data = await axios.get(url)
            //console.log(data)
            //setMessages(data.data)
            setLoading(false)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        testChat()
    }, [url])
    const uploadImageHandler = (e) => {
        setImageUpload(e.target.files[0])       
    }

    const sendUrl = 'http://localhost:3001/message/addMessage'
    const sendMsg =  async() => {
        if(imageUpload != null){
            await uploadImage(channelInfo.chatName, imageUpload)
            var sendImg = await getImage(channelInfo.chatName, imageUpload)
            const gcName = pathId.replace(/%20/g,' ')
            addToChat(newText, gcName, sendImg, currentUser.username)//////firebase
            //await socket.emit("sendMessage", messageState2)
            setImageUpload(null)
            setImgLoading(false)
            setNewText('')
        }else{
            var sendImg = ''
            const gcName = pathId.replace(/%20/g,' ')
            addToChat(newText, gcName, sendImg, currentUser.username)//////firebase
            //await socket.emit("sendMessage", messageState2)
            setImageUpload(null)
            setImgLoading(false)
            setNewText('')
        }

    }

    const getFireBaseMsg = async () => {

        const chatDocRef = doc(db, 'chats', channelInfo.chatName)
        onSnapshot(chatDocRef, (doc) => {
            if(doc.data()){
                var len = doc.data().messages.length
                console.log(len)
                if(len > 0)
                    console.log(doc.data().messages[len-1])
                    var newMessage = doc.data().messages[len-1]
                    setMessages((prev) => [...prev, newMessage])
                    
            }else{
                //alert("chat not found")
                setMessages([{user:'', item:"chat not found"}])
            }
        });
    }
    useEffect(() => {
        if(Object.keys(channelInfo).length > 0){
            const gcName = pathId.replace(/%20/g,' ')
            const chatDocRef = doc(db, 'chats', gcName)
            const unsub = onSnapshot(chatDocRef, (doc) => {
            if(doc.data()){   
                console.log(doc.data().messages)
                setMessages(doc.data().messages)  
            }else{
                setMessages([{user:'', item:"chat not found"}])
            }
            return unsub
        });
        }
    }, [channelInfo])

    //const urls = `http://localhost:3001/groupchat/getGroupchat`

    const groupChatDetails = async() => {
        const urls = `http://localhost:3001/groupchat/getGroupchats/${pathId}`
        try{
            const data = await axios.get(urls)
            console.log(data.data)
            setChannelInfo(data.data)
        }catch(err){
            console.log(err)
        }
    }
    // ----------------- gets user data ---------------//
    useEffect(() => {
        console.log("re-render")
        groupChatDetails()
    }, [pathId])
    
    useEffect(() => {
        scrollDiv.current.scrollIntoView({behavior: 'auto',block: 'center',})
    }, [messages])

    return(
        <div id="chatMain" style={{display:"flex"}}> 
        <div className='msgWrapper'>
            {//Object.keys(channelInfo).length > 0
                messages ? (<h3>{channelInfo.chatName}</h3>) : (null)
            }
            <div id="msgs">
                {
                    imgLoading ? (<HashLoader color={'#00f9df'}loading={loading} size={94} data-test id="loader"/>) : (null)
                }
            {
                loading ? (<HashLoader color={'#00f9df'}loading={loading} size={94} data-test id="loader"/>) : (
                    messages.map((item, idx) => {
                        return(
                            item.sender !== currentUser.username ?(
                            <div key={idx}>
                                <h5 className='textName'>{item.sender}</h5>
                                <div className='textBubble2' key={idx}>
                                    <p>{item.text}</p>
                                {
                                    item.fileUrl!== '' ? (<img alt='' src={item.fileUrl} id='txtImg'></img>) : (null)
                                } 
                                </div>
                            </div>) : 
                            (
                            <div key={idx}>
                                <div className='textBubble' key={idx}>
                                <p>{item.text}</p>
                                {
                                    item.fileUrl !== '' ? (<img alt='' src={item.fileUrl} id='txtImg'></img>) : (null)
                                } 
                                </div>
                            </div>)

                        )
                    })
                )
            }
            <div id="dummyDiv" ref={scrollDiv}></div>
            </div>
            <div id="msgDiv">
                <textarea 
                    value={newText} 
                    onChange={e => setNewText(e.target.value)}
                    maxLength={180}
                ></textarea>
                <input type='file' onChange={uploadImageHandler} id='imgUp'></input>
                <img alt='' id="sendBtn" src={SEND} onClick={sendMsg}></img>
            </div>
        </div>
        <div id="detWrapper">
            { //Object.keys(channelInfo).length <= 0
                loading ? 
                    (<LoaderComp></LoaderComp>)
                :(<MsgDetails details={channelInfo} urls={pathId} gcUsers={channelInfo.users} test={updateUsers2} type='gc'></MsgDetails>)
            }
        </div>
        </div>
    )
}

export default Channel
//---[-[-[------]]]------------------//
/* 
    useEffect(() => {
        if(Object.keys(channelInfo).length > 0){
            const chatDocRef = doc(db, 'chats', channelInfo.chatName)
            const unsub = onSnapshot(chatDocRef, (doc) => {
            if(doc.data()){
                //console.log(doc.data().messages)
                //setMessages(doc.data().messages)  
            }else{
                //alert("chat not found")
                setMessages([{user:'', item:"chat not found"}])
            }
            return unsub
        });
        }
    }, [channelInfo])
*/ 
//---------------------------------//
    /*
    useEffect(() => {
        //setSocket(io.connect("ws://localhost:3002"))
    }, [])
    useEffect(() => {
        socket?.emit("joinRoom", pathId)
    }, [pathId, socket]) 

    useEffect(() => { ////alnsflkasflkasmflkasdf asdklfnlksd
        socket?.on("messageReceived", (msg) => {
            console.log("message received from socket io ")
            setNewMessage(msg)   
            //setMessages((prev) => [...prev, newMessage])
        }) 
        return () => socket?.off('messageReceived');
    }, [socket])
    useEffect(() => {    
        if(newMessage){ 
            setMessages((prev) => [...prev, newMessage])//[...messages, newMessage]
            setNewMessage(null)
        }
    },[newMessage])  
        const sendMsg =  async() => {
        var sendImg = ''
        if(imageUpload != null){
            await uploadImage(channelInfo.chatName, imageUpload)
            var sendImg = await getImage(channelInfo.chatName, imageUpload)

        }else{
            var sendImg = ''
        }

        const messageState = {
            chatNameId: pathId.replace(/%20/g,' '), //.replace('%20',' ')
            sender: currentUser.username,
            text: newText,
            firebaseImgUrl: sendImg
        }
        const messageState2 = {
            chatNameId: pathId,
            sender: currentUser.username,
            text: newText,
            imageUrl: sendImg,
            createdAt: new Date()
        }
        try{
            const sentMsg = await axios.post(sendUrl, messageState)
            const gcName = pathId.replace(/%20/g,' ')
            addToChat(newText, gcName, sendImg, currentUser.username)//////firebase
            //await socket.emit("sendMessage", messageState2)
            setImageUpload(null)
            setImgLoading(false)
            setNewText('')
        }catch(err){ 
            console.log(err)
        }
    }
    */