import './addBox.css'
import axios from 'axios';
import SUB from '../../images/sub.png'
import SEARCH from '../../images/search.png'
import PLUS from '../../images/add.png'
import { useState } from 'react';


function AddUserBox({update, chName, userLisFunc}){
    const [searchUser, setSearchUser] = useState('')
    const [userData, setUserData] = useState({})
    const url = "http://localhost:3001/users/getUser"

    const findUser = async() => {
        try{
            const searchHandler = {
                "findName": searchUser
            }
            const data = await axios.post(url, searchHandler)
            if(data.data){
                console.log(data.data)
                setUserData(data.data)
                setSearchUser('')
            }else{
                setSearchUser('')
                setUserData("user not found")
            }
        }catch(err){
            console.log(err)
        }
    }

    return(
        <div id='addUserBox'>
            <img alt='' id="min" src={SUB} onClick={() => update(1)}></img>
            <div id="searchWrapper">
                <input value={searchUser} onChange={e => setSearchUser(e.target.value)} id="sInput" placeholder='search for user'></input>
                <img alt='' id="search" src={SEARCH} onClick={findUser}></img>
            </div>
            <div id="resDiv">
                {
                    userData === 'user not found' ? (<p>User not found</p>) : 
                    (<DisplayUser userInfo={userData} gcName={chName} updateUserLis={userLisFunc}></DisplayUser>)
                }   
            </div>
        </div>
    )
}
function DisplayUser({userInfo, gcName , updateUserLis}){
    const {username, email, name, userId} = userInfo;

    const addUserUrl = 'http://localhost:3001/groupchat/addUser'

    const addUserToChat = async() => {
        const addedUserHandler = {
            userId: userInfo._id,
            username: userInfo.username,
            chatName: gcName
        }
        try{
            const data = await axios.put(addUserUrl, addedUserHandler)
            updateUserLis()
            console.log(data)
        }catch(err){
            alert("could not add user to chat")
            console.log(err)
        }
    }
    return(
        <div style={{display:"flex"}}>
            <div>
                <p>{username}</p>
                <p>{email}</p>
            </div>
            <div>
                <img alt='' id="addIg" src={PLUS} onClick={addUserToChat}></img>
            </div>
        </div>
    )
}
export default AddUserBox;