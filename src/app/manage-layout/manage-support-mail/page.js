'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure to import axios
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react';
import Image from 'next/image';
import DateConverter from '@/utils/dateConverter';


function MailBox() {
  const [supoortInbox, setSupoortInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupportInbox = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/layout/contact');
        setSupoortInbox(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportInbox();
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log(supoortInbox);
  
  return (
    <div>
      <h1>MailBox</h1>
      <div>
      <Divider/>
      </div>
      <div className='py-4 grid grid-flow-col grid-cols-4 gap-3'>
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
    <Card className="max-w-[400px] shadow-md">
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
