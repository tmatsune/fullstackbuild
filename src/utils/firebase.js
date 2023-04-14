import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    arrayUnion,
    updateDoc,
    arrayRemove,
    deleteDoc
} 
from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAWPjyFzUBnJ6y4kIT87UVWTQcGVsTLoxQ",
  authDomain: "bildapp-ec335.firebaseapp.com",
  projectId: "bildapp-ec335",
  storageBucket: "bildapp-ec335.appspot.com",
  messagingSenderId: "495175889920",
  appId: "1:495175889920:web:8895c0d92e911bdaf394e5"
};
//---------------------- vars -----------------------//
const app = initializeApp(firebaseConfig);
export const db = getFirestore()
export const storage = getStorage();
//---------------getting iamge for profile -------------//
export const getImage2 = async (file) => {
    const imageRef = ref(storage, `profilePics/${file.name}`)
    const data = await getDownloadURL(imageRef)
    console.log(data)
    return data
}
export const uploadProfilePic = async (file) => {
    const imageRef = ref(storage, `profilePics/${file.name}`)
    try{
        const res = await uploadBytes(imageRef, file)
        console.log(res)
    }catch(error){
        console.log(error)
    }
}
//------------- getting image for groupchats/dms -----------//
export const uploadImage = async (chatName, file) => {
    const imageRef = ref(storage, `${chatName}/${file.name}`)
    try{
        const res = await uploadBytes(imageRef, file)
        console.log(res)
    }catch(error){
        console.log(error)
    }
}
export const getImage = async (chatName, file) => {
    const imageRef = ref(storage, `${chatName}/${file.name}`)
    const data = await getDownloadURL(imageRef)
    console.log(data)
    return data
}
//---------------------- getMessages ------------------//
export const addToChat = async(text, chatName, img, sender) => {
    console.log(img)
    const chatRef = doc(db, "chats", chatName)
    await updateDoc(chatRef, {//text
        messages: arrayUnion({
            text:text,
            sender: sender,
            fileType: 'none',
            fileUrl: img,
            date: new Date()
        })
    })
    console.log("added message")
}
export const createGroupChat = async(input) => {
    const subDocRef = doc(db, "chats", input)
    const subSnap = await getDoc(subDocRef)
    if(subSnap.exists() === false){
        try{
            await setDoc(subDocRef, {
                messages:[],
                chatName: input,
            })
            console.log("success")
        }catch(error){
            console.log(error)
        }
    }else{
        alert("chat already exists")
    }
}
export const deleteChat = async(input) => {
    const subDocRef = doc(db, "chats", input)
    console.log("chat deleted")
    await deleteDoc(subDocRef)
}