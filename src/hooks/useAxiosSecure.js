"use client"
import axios from "axios";
import { useEffect } from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase.config";
import { useRouter } from "next/navigation";

const axiosSecure = axios.create({
    baseURL: 'https://smartserver.smartoriginalbrand.com/api/'
})

const useAxiosSecure = () => {
    const router = useRouter();
    const [signOut] = useSignOut(auth);
    
    useEffect(() => {
        // request interceptor to add authorization header for every secure call to the api
        axiosSecure.interceptors.request.use(function(config){
            const token = localStorage.getItem("access-token");
            config.headers.authorization = `Bearer ${token}`;
            return config;
        }, function(err){
            return Promise.reject(err)
        });

        // intercepts 401 and 403 status
        axiosSecure.interceptors.response.use(function(response){
            return response;
        }, async (error) => {
            const status = error.response.status;
            if(status === 401 || status === 403){
                await signOut();
                router.push("/login");
            }
            return Promise.reject(error);
        });

        // Cleanup function
        return () => {
            axiosSecure.interceptors.request.eject();
            axiosSecure.interceptors.response.eject();
        };
    }, [signOut, router]); // Add navigate and logOut to dependency array

    return axiosSecure;
}

export default useAxiosSecure;
