
import axios from "axios"

export const remUser = async (urlId, newUserName) => {
    const url = `http://localhost:3001/groupchat/remUser/${urlId}`
    const inputHandler = {
        username: newUserName
    }
    try{
        const data = await axios.put(url, inputHandler)
        console.log(data.data)
    }catch(err){
        console.log(err)
    }
}