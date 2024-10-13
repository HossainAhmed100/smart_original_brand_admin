"use client"
import {Spinner} from "@nextui-org/react";
import UserOrdersCard from "@/components/orders/userOrdersCard";
import { auth } from "@/firebase/firebase.config";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query"
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";


function ManageOrders() {
  useEffect(() => {
    document.title = 'Manage User Orders | Admin Dashboard | Smart Original Brand Online Shop';
  }, []);
  const [user] = useAuthState(auth);
  const axiosSecure = useAxiosSecure();
  const {data: manageOrders = [], isLoading} = useQuery({
    queryKey: ["manageOrders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/getAllOrdersAdmin`);
      return res.data;
    },
  })
  if(isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="xl" className="animate-spin" /></div>
  }
  return (
    <div>
    <div className="flex w-full flex-col">
      <div className="space-y-4"> 
      {manageOrders.map(item => <UserOrdersCard item={item} key={item._id}/>) }
      </div>
    </div> 
    </div>
  )
}


export default ManageOrders