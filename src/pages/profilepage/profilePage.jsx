import './profilePage.css'
import { UserContext } from '../../context/userContext'
import { ChannelContext } from '../../context/channelConext'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { fetchData } from '../../hooks/updateList'
import LoaderComp from '../../components/loader/loaderComp'
import HashLoader from "react-spinners/HashLoader";
import { uploadProfilePic, getImage2 } from '../../utils/firebase'
import axios from 'axios'

function ProfilePage(){
    const {currentUser, profileImg, dispatchUser} = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const {dmLinks, groupChatLinks, dispatch} = useContext(ChannelContext)

    const updateProfileImg = async() => {
        const profUrl = `http://localhost:3001/users/reqItem/${currentUser._id}/profileUrl`
        const newProf = await fetchData(profUrl)
        dispatchUser({type:"changeProf", payload:newProf})
    }
    useEffect(() => {
        updateProfileImg()
    }, [currentUser])
    
    const updateChatList = async () => {
        if(currentUser){
            const chatUrl = `http://localhost:3001/users/reqItem/${currentUser._id}/groupChats`
            const newList = await fetchData(chatUrl)
            //console.log(newList)
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
    useEffect(() => {
        const getBoth = async() => {
            setLoading(true)
            await updateChatList()
            await updateDmList()
            setLoading(false)
        }
        getBoth()
    } ,[currentUser])

    return(
        <div id="profMain" style={{display: "flex"}}>
            {   //currentUser
                currentUser ? (<ProfileCard userInfo={currentUser} prof={profileImg}></ProfileCard>) : (null)
            }
            {   //cuurentUser
                currentUser ? (<ProfileDetails userChats={groupChatLinks} userDms={dmLinks} userName={currentUser.username} ></ProfileDetails>) 
                : (<LoaderComp></LoaderComp>)
            }
        </div>
    )
}
function ProfileCard({userInfo, prof}){
    const [imageLoading, setImageLoading] = useState(false)
    const [imageUpload, setImageUpload] = useState(null)
    const {dispatchUser} = useContext(UserContext)
    const profPicHandler = (e) => {
        setImageUpload(e.target.files[0])
    }
    const changeProfilePic = async() => {
        if(imageUpload !== null){
            setImageLoading(true)
            await uploadProfilePic(imageUpload)
            const imgUrl = await getImage2(imageUpload)
            //console.log(imgUrl)
            const url = `http://localhost:3001/users/updateUserImage/${userInfo._id}`
            const params = {firebaseImage: imgUrl}
            await axios.put(url, params)
            //await updateUserProfPic(imgUrl)
            dispatchUser({type:"changeProf", payload:imgUrl})
            setImageLoading(false)
            setImageUpload(null)

        }else{
            alert('image not found')
        }
    }  

    return(
        <div id="profCard">
            {
                imageLoading ? (<HashLoader color={'#00f9df'}loading={imageLoading} size={44} data-test id="profLoader"/>) : (
                    <img alt='' id='profImg' src={prof}></img>
                )
            }
            <div id="changeDiv">
                <p>change profile pic</p>
                <hr></hr>   
                <input type='file' onChange={profPicHandler} id="imgInp"></input>
                <span id="submitBtn"onClick={changeProfilePic} >Submit</span>
            </div>
            <h2>{userInfo.username}</h2>
            <h3>{userInfo.name}</h3>
            <h3>{userInfo.email}</h3>
            <Link to={`/friends/${userInfo._id}`} id="fri">Friends</Link>
            <div id="socLinks">

            </div>
        </div>
    )
}
function ProfileDetails({userChats, userDms, userName}){
    return(
        <div id="profDetails" style={{display:"flex"}}>
            <div id='profLis'>
            <h3>Groupchats</h3>
            <hr></hr>
            {
                userChats.map((item, idx) => {
                    return(
                        <p key={idx}>{item}</p>
                    )
                })
            }
            </div>
            <div id='profLis'>
            <h3>Dms</h3>
            <hr></hr>
            {
                userDms.map((item, idx) => {
                    return(//item.split(',')[1]
                        <p key={idx}>{userName === item.split(',')[0] ? (item.split(',')[1]) : (item.split(',')[0])}</p>
                    )
                })
            }
            </div>
        </div>
    )
}
export default ProfilePage;