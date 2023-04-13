import './docsPage.css'
import 'quill/dist/quill.snow.css'
import { useRef, useState, useEffect, useContext } from 'react';
import ReactQuill from 'react-quill'
import { useLocation } from 'react-router'; 
import axios from 'axios'
import {fetchData} from '../../hooks/updateList'
import { UserContext } from '../../context/userContext';
import PLUS from '../../images/save.png'

function Docs(){
    const [docData, setDocData] = useState('')
    const location = useLocation()
    const docId = location.pathname.split('/')[2]
    const {currentUser} = useContext(UserContext)
    const [fav, setFav] = useState(null)
    
    const getDocInfo = async() => {
        const url = `http://localhost:3001/docs/getDocument/${docId}`
        const quillText = await fetchData(url)
        setDocData(quillText.data.info)
        setFav()
    }  
    const saveDocs = async() => {
        const url = `http://localhost:3001/docs/saveDocs/${docId}`
        const dataToSave = {
            newInfo: docData
        }
        try{
            const docInfo = await axios.put(url, dataToSave)
            console.log(docInfo)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        getDocInfo()
    }, [docId])

    return(
        <div id="docMain" >
            <img alt='' id="saveBtn" onClick={saveDocs} src={PLUS}></img>
            <ReactQuill id="quill" value={docData} onChange={e => setDocData(e)}></ReactQuill>
        </div>
    )
}
export default Docs;
/*
const modules= {
        toolbar: {
            //container: ['bold', 'italic', 'custom'], 
            //header: [1, 2, 3, 4, 5, 6]
        }
    }
*/