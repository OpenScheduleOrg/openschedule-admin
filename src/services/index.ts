import axios, {AxiosInstance} from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    headers:{
        "content-type": "application/json",
    },
    withCredentials: true
})


export default  axiosInstance;
