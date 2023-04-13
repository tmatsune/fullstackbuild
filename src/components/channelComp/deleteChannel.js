import axios from "axios"




export const deleteGroupChat = async (id, chatName) => {
    const url1 = `http://localhost:3001/groupchat/deleteLis/${id}`
    const url2 = `http://localhost:3001/groupchat/delete/${id}`
    const url3 = `http://localhost:3001/message/deleteGcMessages/${chatName}`
    try{
        const usersLis = await axios.put(url1);
        const delChat = await axios.delete(url2);
        const delMsgs = await axios.delete(url3);
        console.log("chat has been deleted")
    }catch(err){
        console.log(err)
    }
}


export const deleteDmChat = async(id, chatName) => {
    const url1 = `http://localhost:3001/dms/deleteLis/${id}`
    const url2 = `http://localhost:3001/dms/deleteDm/${id}`
    const url3 = `http://localhost:3001/message/deleteGcMessages/${chatName}`
    try{
        const usersLis = await axios.put(url1);
        const delChat = await axios.delete(url2);
        const delMsgs = await axios.delete(url3);
        console.log("chat has been deleted")
    }catch(err){
        console.log(err)
    }
}