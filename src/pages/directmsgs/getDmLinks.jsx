import './getDms.css'
import axios from 'axios'
import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChannelContext } from '../../context/channelConext'
import { UserContext } from '../../context/userContext'

function GetDmLinks(){
    //const {currentUser} = useContext(UserContext)
    const {dmLinks} = useContext(ChannelContext)

    return(
        <div className='dmLinksDiv'>   
        
            {
                dmLinks.map((item, idx) => {
                    return(
                        <DmRedirect dmLink={item} key={idx}></DmRedirect>
                    )
                })
            }
        </div>
    )

}
function DmRedirect({dmLink}){
    const {currentUser} = useContext(UserContext)
    const displayChatName = dmLink.split(',')[1]
    const displayChatName1 = dmLink.split(',')[0]
    
    return(
        <li id="chLink">
        {
            displayChatName !== currentUser.username ? (<Link to={`/dms/${dmLink}`}  id="chLink">#{displayChatName}</Link>) 
            : (<Link to={`/dms/${dmLink}`}  id="chLink">#{displayChatName1}</Link>)
        }
        </li>
    )
}
export default GetDmLinks