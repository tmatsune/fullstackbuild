 
import './docsStart.css'
import PLUS from '../../images/add.png'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useState, useContext } from 'react'
import {UserContext} from '../../context/userContext'
import { useEffect } from 'react'
import FILE from '../../images/file.png'
import ScaleLoader from "react-spinners/PropagateLoader";
import { deleteDoc } from './removeDoc'
import REJ from '../../images/rejected.png'

function DocsStart(){
    const [userDocs, setUserDocs] = useState([])
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const {currentUser} = useContext(UserContext)
    const toggle = () => {
        if(show){
            setShow(false)
        }else{
            setShow(true)
        }
    }
    console.log(currentUser)
    const getDocInfo = async() => {
        const params = {currUserName:currentUser.username}
        const url = 'http://localhost:3001/docs/getUserDocs'
        try{
            setLoading(true)
            const data = await axios.post(url, params)
            console.log(data.data)
            setUserDocs(data.data)
            setLoading(false)
        }catch(err){
            console.log(err)
        }
    }
    const remDoc = async(id, docname, username) => {
        await deleteDoc(id, docname, username)
        //console.log(docname)
        getDocInfo()
    }

    useEffect(() => {
        getDocInfo()
    }, [currentUser])

    return(
        <div id="docStartMain">
            <div className='createDocBox'>
                <img alt='' id="addDocBtn" src={PLUS} onClick={toggle}></img>
                {
                    show ? (<CreateDoc update={getDocInfo}></CreateDoc>) : (null)
                }
            </div>
            <div className='lisDocs'>
                {
                    loading ? (
                    <div>
                        <ScaleLoader color={'#00f9df'}loading={loading} size={20} data-test id="docLoader"/>
                        <ScaleLoader color={'#00f9df'}loading={loading} size={20} data-test id="docLoader1"/>
                        <ScaleLoader color={'#00f9df'}loading={loading} size={20} data-test id="docLoader2"/>
                    </div>
                    ) 
                    : (    

                    userDocs.map((item, idx) => {
                        return(
                            <div className='docSnap' key={idx}>
                                <div id='detailsDiv'>
                                    <img alt='' id="fileImg" src={FILE}></img>
                                    <hr></hr>
                                    <Link to={`/docs/${item.docName}`} id='docDet'>{item.docName.split(',')[0]}</Link>
                                    <img onClick={() => remDoc(item._id, item.docName, currentUser.username)} alt='' id="remBtn" src={REJ}></img>
                                </div>
                            </div>
                        )
                    
                    })
                    )
                }

            </div>

        </div>
    )
}
function CreateDoc({update}){
    const {currentUser} = useContext(UserContext)
    const [namedDoc, setNameDoc] = useState('')
    const createUrl = 'http://localhost:3001/docs/createDoc'
    const createDoc = async() => {
        const params = {
            docsName: namedDoc,
            currUserName: currentUser.username,
            textData: {info: ''},
            isFave: false
        }
        try{
            const data = await axios.post(createUrl, params)
            console.log(data)
            setNameDoc('')
            update()
        }catch(err){
            console.log(err)
        }
    }

    return(
        <div id="createDocDiv">
            <label>Document Name: </label>
            <input id='docInput' value={namedDoc} onChange={e => setNameDoc(e.target.value)}></input>
            <img alt='' id="sendBtn" src={PLUS} onClick={createDoc}></img>
        </div>
    )


}
export default DocsStart;