import useAxiosPublic from '@/hooks/useAxiosPublic'
import { useQuery } from "@tanstack/react-query";
import React from 'react'

function SupportInbox() {
  const axiosPublic = useAxiosPublic();
  const {data: sizeGuideInfo = [], refetch} = useQuery({
    queryKey: ["sizeGuideInfo"],
    queryFn: async () => {
      const res = await axiosPublic.get('/layout/sizeGuide/');
      return res.data;
    },
  })
  console.log(sizeGuideInfo)
  return (
    <div>
      
    </div>
  )
}

export default SupportInbox