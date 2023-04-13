
import './navBar.css'
import { Fragment, useContext, useState, useEffect } from 'react'
import './navBar.css'
import { Outlet, Link } from 'react-router-dom'
import { UserContext } from '../../context/userContext'
import axios from "axios"
import GetGcLinks from '../groupchats/getGcList'
import PLUS from '../../images/add.png'
import CreateAddBox from '../../components/addbox/createChatBox'
import { fetchData } from '../../hooks/updateList'
import { ChannelContext } from '../../context/channelConext'
import GetDmLinks from '../directmsgs/getDmLinks'

function NavBar(){
    const {currentUser, dispatchUser} = useContext(UserContext)
    const [chatLinks, setChatLinks] = useState([])
    const [show, setShow] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const {dispatch, groupChatLinks} = useContext(ChannelContext)
    const [showDm, setShowDm] = useState(false)

    const getUserChats = async () => {
        if(currentUser){
            //console.log(currentUser._id)
            const url =`http://localhost:3001/users/getuserchats/${currentUser._id}`
            try{
                const data = await axios.get(url)
                setChatLinks(data.data)
            }catch(err){
                setChatLinks([])
                console.log(err)
            }
        }
    }
    const toggle = () => {
        if(show){
            setShow(false)
        }else{
            //getUserChats()
            updateChatList()
            setShow(true)
        }
    }
    const toggle1 = () => {
        if(showAdd){
            setShowAdd(false)
        }else{
            setShowAdd(true)
        }
    }
    const toggle2 = () => {
        if(showDm){
            setShowDm(false)
        }else{
            updateDmList()
            setShowDm(true)
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
    const logOutUser = async() => {
        dispatchUser({type:"logout"})

    }
    
    return(
        <Fragment>
        <header></header>
        <div id="navbar">
            <ul>
                {
                    currentUser ? (<Link to="/"><li onClick={logOutUser}>Log out</li></Link>) : (null)
                }
                <div>
                    <li><Link to="/">Home</Link></li>
                </div>
                {
                    currentUser ? (
                <div id="currUser?">
                <div>
                    <li><Link to="/startDocs">bild docs</Link></li>
                </div>
                <div style={{display:"flex"}}>
                    <li onClick={toggle2}><Link>direct messages</Link></li>
                </div>
                    {
                        showDm ? (<GetDmLinks></GetDmLinks>) : (null)
                    }

                <div style={{display:"flex"}}>

                    <li onClick={toggle}><Link>Group Chat</Link></li>

                    <img alt='' id="plus" src={PLUS} onClick={toggle1}></img>
                    {
                        showAdd ? (<CreateAddBox update={toggle1}></CreateAddBox>) : (null)
                    }
                </div>  
                    {
                        show ? (<GetGcLinks links={chatLinks}></GetGcLinks>) : (null)
                    }
                <div>
                    <li><Link to='/search'>Search</Link></li>
                </div>
                <div>
                    <li><Link to="/profile">Profile</Link></li>
                </div>
                </div>
                ) : (null)
                }   
  
                <div>
                    <li><Link to='/login'>Log In</Link></li>
                </div>
            </ul>
        </div>
        <Outlet></Outlet>
        </Fragment>
    )
}
export default NavBar;