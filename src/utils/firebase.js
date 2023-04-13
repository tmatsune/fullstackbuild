import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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