import axios from "axios";

// Create an Axios instance with a base URL for making HTTP requests
const axiosPublic = axios.create({
    baseURL: 'https://smartserver.smartoriginalbrand.com/api/'
});

// Custom hook to return the Axios instance
const useAxiosPublic = () => {
    return axiosPublic;
}

export default useAxiosPublic;








