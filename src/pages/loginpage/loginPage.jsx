import './loginPage.css'
import { useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../../context/userContext'
import { useEffect } from 'react'

//const url = 'http://localhost:3001/message/getMessages/testChat'
function LoginPage(){
    const [data, setData] = useState({}) 
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const {dispatchUser} = useContext(UserContext)

    const loginState = {
        email: email,
        password: pass
    }

    const fetchDataLog = async () => {
        setLoading(false)
        const url = 'http://localhost:3001/auth/login'
        try{
            console.log("here")
            const data = await axios.post(url, loginState)
            console.log(data.data)
            dispatchUser({type:"login", payload:data.data})
            setPass('')
            setEmail('')
        }catch(err){
            setPass('')
            setEmail('')
            alert("wrong username or password")
            console.log(err)
        }
    }
    const testLogin = () => {
        dispatchUser({type:"login", payload:{sdfd:"adfsdfsdf"}})
    }
    return(   
        <div id="logMain">
        <div id="logDiv" >
            <div id="logWrapper">
            <h3>Login</h3>
            <div id="inpLabel">
                <p>email:</p>
                <input 
                placeholder='enter email'
                value={email} 
                onChange={e => setEmail(e.target.value)}
                name="email1"
                ></input>
            </div>
            <div id="inpLabel">
                <p>password:</p>
                <input 
                placeholder='enter password'
                value={pass} 
                onChange={e => setPass(e.target.value)}
                name="pass"
                type='password'
                ></input>
            </div>
            <button onClick={fetchDataLog} id="logBtn">Log In</button>
            </div>
        </div>
        <RegisterCard></RegisterCard>
        </div>
    )

}
function RegisterCard(){
    const [nam, setName] = useState('')
    const [email1, setEmail] = useState('')
    const [userName1, setUserName] = useState('')
    const [pass, setPass] = useState('')
    const {dispatchUser} = useContext(UserContext)

    const reset = () => {
        setName('')
        setEmail('')
        setUserName('')
        setPass('')
    }
    const registerState = {
        name: nam,
        email: email1,
        username: userName1,
        password: pass
    }

    const registerApi = async() => {//https://wonderful-zabaione-bd1ac9.netlify.app
        const url = 'https://wonderful-zabaione-bd1ac9.netlify.app/auth/register'//http://localhost:3001/auth/register
        try{
            const userData = await axios.post(url, registerState)
            console.log(userData.data)
            dispatchUser({type:"login", payload: userData.data})
            reset()

        }catch(err){
            reset()
            alert("username or email already used")
            console.log(err)
        }
    }   

    return (
        <div id="regDiv">
            <div id='regWrapper'>
                <h3>Register</h3>
            <div id="inpLabel">
                <p>name</p>
                <input value={nam} onChange={e => setName(e.target.value)} placeholder='enter name' name="name"></input>
            </div>
            <div id="inpLabel">
                <p>email</p>
                <input value={email1} onChange={e => setEmail(e.target.value)} placeholder='enter email' name="email"></input>
            </div>
            <div id="inpLabel">
                <p>username</p>
                <input value={userName1} onChange={e => setUserName(e.target.value)} placeholder='enter username' name="usern"></input>
            </div>
            <div id="inpLabel">
                <p>password</p>
                <input value={pass} onChange={e => setPass(e.target.value)} placeholder='enter password' name="password"
                type='password'></input>
            </div>

            
            <button onClick={registerApi} id="logBtn">Register</button>
            </div>
        </div>
    )
}
export default LoginPage