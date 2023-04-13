

import axios from "axios";
import { useEffect, useState } from "react";

export const useUpdateList = async(url, params) =>  {
    const [loading, setLoading] = useState(false)
    const [newData, setNewData] = useState([])
    const [error, setError] = useState(null)

    const fetchData = async() => {
        try{
            setLoading(true)
            const data = await axios.get(url, params)
            console.log(data.data)
            setNewData(data.data)
            setLoading(false)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        fetchData()
    }, [url])

    return {loading, newData, error}
}