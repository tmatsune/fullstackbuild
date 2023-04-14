import './dms.css'
import { useEffect, useState, useContext, useRef } from 'react';
import { useLocation } from 'react-router';
import { io } from 'socket.io-client';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import MsgDetails from '../../components/msgdetails/msgDetails';
import { fetchData } from '../../hooks/updateList';
import HashLoader from "react-spinners/HashLoader";
import LoaderComp from '../../components/loader/loaderComp';
import SEND from '../../images/send.png'
import { useNavigate } from "react-router-dom";
import { getImage, uploadImage, addToChat, db } from '../../utils/firebase'
import { doc, onSnapshot } from 'firebase/firestore'


function Dms(){
    const location = useLocation()
    const pathId = location.pathname.split("/")[2]
    const {currentUser} = useContext(UserContext)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newText, setNewText] = useState('')
    const [socket, setSocket] = useState(null);
    const [newMessage, setNewMessage] = useState(null) 
    const [dmInfo, setDmInfo] = useState({})
    const scrollDiv = useRef(null)
    const navigate = useNavigate();
    const [imageUpload, setImageUpload] = useState(null)
    const [imgLoading, setImgLoading] = useState(false)

    useEffect(() => {
        if(currentUser && Object.keys(dmInfo).length > 0){
            if(!dmInfo.users.includes(currentUser.username)){
                navigate("/");
            }else{
                console.log("user authenticated")
            }
        }
    }, [currentUser, dmInfo])
    
    const updateUsers2 = async () => {
        const url = `http://localhost:3001/groupchat/getType/${dmInfo._id}/users`
        const list = await fetchData(url)
        //console.log(list)
        setDmInfo({...dmInfo, users: list})
    }

    const url = `http://localhost:3001/message/getmessagess/${pathId}`
    const testChat = async() => {
        setLoading(true) 
        try{
            const data = await axios.get(url)
            //console.log(data)
            setMessages(data.data)
            setLoading(false)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        testChat()
    }, [url])

    const sendUrl = 'http://localhost:3001/message/addMessage'
    const sendMsg =  async() => {
        if(imageUpload != null){
            await uploadImage(dmInfo.chatName, imageUpload)
            var sendImg = await getImage(dmInfo.chatName, imageUpload)
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

    useEffect(() => {
        if(Object.keys(dmInfo).length > 0){
            const chatDocRef = doc(db, 'chats', dmInfo.chatName)
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
    }, [dmInfo])
 
    //----------getting info -------------//

    const groupChatDetails = async() => {
        const urls = `http://localhost:3001/groupchat/getGroupchats/${pathId}`
        try{
            const data = await axios.get(urls)
            //console.log(data.data)
            setDmInfo(data.data)
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

    const test = () => {
        console.log(currentUser)
        console.log(dmInfo)
    }
    return(     
        <div id='dmsMain' style={{display:"flex"}}>
        <div className='msgWrapper'>
            {//Object.keys(channelInfo).length > 0
                messages ? (<h3>{dmInfo.chatName}</h3>) : (null)
            }
            <div id="msgs">

            {
                loading ? (<HashLoader color={'#00f9df'}loading={loading} size={94} data-test id="loader"/>) : (
                    messages.map((item, idx) => {
                        return(
                            item.sender !== currentUser.username ?(
                            <div key={idx}>
                                <h5 className='textName'>{item.sender}</h5>
                                <div className='textBubble2' key={idx}>
                                    <p>{item.text}</p>
                                </div>
                            </div>) : 
                            (//<h5 className='textName'>{item.sender}</h5>
                            <div key={idx}>
                                <div className='textBubble' key={idx}>
                                <p>{item.text}</p>
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
                <img alt='' id="sendBtn1" src={SEND} onClick={sendMsg}></img>
            </div>
        </div>
        <div id="detWrapper">
            { //Object.keys(channelInfo).length <= 0
                loading ? 
                    (<LoaderComp></LoaderComp>)
                :(<MsgDetails details={dmInfo} urls={pathId} gcUsers={dmInfo.users} test={updateUsers2} type="dm"></MsgDetails>)
            }
        </div>
        </div>
    )
}
export default Dms;

/*
    useEffect(() => {
        setSocket(io.connect("https://wonderful-zabaione-bd1ac9.netlify.app/"))//ws://localhost:3002
    }, [])

    useEffect(() => {
        socket?.emit("joinRoom", pathId)
    }, [pathId, socket]) 
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
            //setMessages((prev) => [...prev, newMessage])//[...messages, newMessage]
            setNewMessage(null)
        }
    },[newMessage])  
*/
//----------------