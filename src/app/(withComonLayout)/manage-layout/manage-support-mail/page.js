'use client'
import React from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react';
import DateConverter from '@/utils/dateConverter';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';


function MailBox() {
  const axiosPublic = useAxiosPublic();

  const {data: supoortInbox = [], isLoading} = useQuery({
    queryKey: ["supoortInbox"],
    queryFn: async () => {
      const res = await axiosPublic.get('/layout/contact');
      return res.data;
    }
  })

  if (isLoading) return <div>Loading...</div>;

  
  return (
    <div>
      <h1>MailBox</h1>
      <div>
      <Divider/>
      </div>
      <div className='py-4 grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3'>
      {supoortInbox && supoortInbox.map((type) => (
        <MessageCrad key={type._id} data={type} /> 
      ))}
      </div>
      
    </div>
  );
}

const MessageCrad = ({data}) => {
  const {createdAt, fullName, email, message} = data;
  return (
    <Card className="max-w-[400px] border shadow-md">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">{fullName}</p>
          <p className="text-small text-default-500">{<DateConverter createdAt={createdAt}/>}</p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
        <pre>{message}</pre>
      </CardBody>
      <Divider/>
      <CardFooter>
        <Button>{email}</Button>
      </CardFooter>
    </Card>
  );
}

export default MailBox;
