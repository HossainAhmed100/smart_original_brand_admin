import { useState, useEffect } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import {auth} from "../firebase/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";

const useUser = () => {
    const [user] = useAuthState(auth);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosSecure.get(`/users/${user?.email}`); // Adjust endpoint if necessary
                setUserInfo(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [user?.email, axiosSecure]);

    return { userInfo, loading, error };
};

export default useUser;
