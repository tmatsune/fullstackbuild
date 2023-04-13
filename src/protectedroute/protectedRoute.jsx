
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Outlet, Navigate } from "react-router";
import { useNavigate } from "react-router-dom";

function ProtectedRoute(){
    const {currentUser} = useContext(UserContext)
    const navigate = useNavigate();

    const isAuth = () => {
        if(currentUser){
            console.log("here")
            return true
        }else{
            console.log("sdfsdfsdf")
            return false
        }
    }
    const auth = isAuth()
    
    return(
        auth ? (<Outlet></Outlet>) : (<Navigate to='/login'></Navigate>)
    )
}
export default ProtectedRoute;