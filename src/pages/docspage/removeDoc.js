
import axios from "axios";


export const deleteDoc = async (id, docname, username) => {
    const url1 = 'http://localhost:3001/docs/removeDocFromUser'
    const url2 = `http://localhost:3001/docs/removeDoc/${id}`
    const paramsUser = {
        username, username,
        docName: docname
    }
    try{
        const usersLis = await axios.put(url1, paramsUser);
        const delChat = await axios.delete(url2)
        console.log("chat has been deleted")
    }catch(err){
        console.log(err)
    }
}