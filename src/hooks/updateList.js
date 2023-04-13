
import axios from "axios";

export const fetchData = async(url, params) => {
        try{
            const data = await axios.get(url, params)
            //console.log(data.data)
            return data.data
        }catch(err){
            console.log(err)
        }
    }