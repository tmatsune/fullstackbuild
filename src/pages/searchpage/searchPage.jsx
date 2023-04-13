
import './searchPage.css'
import SUB from '../../images/sub.png'
import SEARCH from '../../images/search.png'
import PLUS from '../../images/addUser.png'
import axios from 'axios'
import { useState, useContext } from 'react'
import { UserContext } from '../../context/userContext'


function SearchPage(){
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
        <div id='searchMain'>
            <div id="searchWrappers">

            <div id="searchBar">
                <input value={searchUser} onChange={e => setSearchUser(e.target.value)} id="sInput" placeholder='search for user'></input>
                <img alt='' id="searchPng" src={SEARCH} onClick={findUser}></img>
            </div>

            <div id="">
                {
                    userData === 'user not found' ? (<p>User not found</p>) : 
                    (<DisplayUsers userInfo={userData} ></DisplayUsers>)
                }   
            </div>

            </div>
        </div>
    )
}
function DisplayUsers({userInfo}){
    const {username, email, name} = userInfo;
    const {currentUser} = useContext(UserContext)

    const addUserToChat = async() => {
        const addUserUrl = `http://localhost:3001/users/addFriend/${currentUser._id}`
        const addedUserHandler = {
            friendToAdd: username,
        }
        try{
            const data = await axios.put(addUserUrl, addedUserHandler)
            console.log(data)
        }catch(err){
            alert("could not add to friends")
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
                {
                    name !== undefined ? (<img alt='' id="addUser" src={PLUS} onClick={addUserToChat}></img>)
                    : (null)
                }
                 
            </div>
        </div>
    )
}
export default SearchPage