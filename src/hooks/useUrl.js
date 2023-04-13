import axios from 'axios'
import { useEffect, useState } from 'react'


const useFetchList = (url) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getUrlData = async() => {
            setLoading(true)
            try{
                const data1 = axios.get(url)
                setData(data1.data)
            }catch(err){
                console.log(err)
            }
        }
        getUrlData()
    }, [url])
    return {loading, data}
}