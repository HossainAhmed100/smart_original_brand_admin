"use client"
import useAxiosSecure from '@/hooks/useAxiosSecure';
import DateConverter from '@/utils/dateConverter';
import { Button, Spinner, Link, Chip, Divider, Select, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaCalendar } from 'react-icons/fa';

const OrderDetails = ({ params }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [totalPayment, setTotalPayment] = useState(0);
  const axiosSecure = useAxiosSecure(); 

  const { data: ordersInfo, isLoading, refetch } = useQuery({
    queryKey: ['ordersInfo', params.orderid],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/getOrderDetailsAdmin/${params.orderid}`);
      return res.data;
    }
  });

  useEffect(() => {
    const charger = ordersInfo?.deliveryChargeDetails?.deliveryCost || 0;
    const total = ordersInfo?.myCart.reduce((acc, item) => acc + item.price * item.quantityPurchase, 0) || 0;
    setTotalPayment(total + charger);
  }, [ordersInfo]);

  const myCart = ordersInfo?.myCart || [];

  const orderStatus = [
    {label: "New Order", key: "newOrder", colors: "danger"},
    {label: "Shipped", key: "shipped", colors: "success"},
    {label: "Delivered", key: "delivered", colors: "primary"},
    {label: "Cancelled", key: "cancelled", colors: "danger"},
    {label: "Refunded", key: "refunded", colors: "warning"},
    {label: "Returned", key: "returned", colors: "secondary"},
  ]

  // Form submission handler
  const onSubmit = async (data) => {
  setLoading(true)
  const orderStatusKey = {
    status: data.status
  };
  await axiosSecure.put(`/orders/updatedOrderStatus/${params.orderid}`, orderStatusKey)
    .then((response) => {
      setLoading(false)
      if(response.status === 200){
        toast.success('Successfully Updated!')
        refetch()
      }
    })
  };

  if(isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="xl" className="animate-spin" /></div>
  }
  return (
    <div>
      <div className='grid lg:grid-cols-2 grid-cols-1'>
        <div className='p-4'>
        <div className="border-1 overflow-hidden border-gray-200 shadow-lg rounded-lg">
          <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
              <h1 className='text-xl font-medium'>Ordered Items</h1>
            <Button color="default" variant="flat" startContent={<FaCalendar />}>{<DateConverter createdAt={ordersInfo?.createdAt}/>}</Button>
          </div>
          <div className="p-4 space-y-2">
            {
              myCart.map(item => {
                return (
                  <div className="border-1 rounded-lg border-gray-200" key={item.itemKey}>
                  <div className="flex border-b-1 items-center justify-start">
                    <div className="px-4  border-r-1">
                    <Image src={item.thumbImage[0]} alt={item.name} width={80} height={80}/>
                    </div>
                    <div className="px-4">
                      <h1>
                      {item.name} 
                      <Link
                        isExternal
                        href={`http://zeroexclusive.com/all-products/${item?.productId}`}
                        showAnchorIcon
                        className='ml-2'
                      >
                        View Product
                      </Link>
                      </h1>
                      <strong className='text-2xl'>Tk.{item.price}</strong>
                    </div>
                  </div>
                  <div className='p-2 flex flex-col'>
                    <div className='p-2 flex items-center justify-between'>
                        <span>Quantity:</span> <Chip>{item.quantityPurchase} PCS</Chip>
                    </div>
                    <div><Divider /></div>
                    <div className='p-2 flex items-center justify-between'>
                        <span>Brand:</span> <Chip>{item.brand}</Chip>
                    </div>
                    <div><Divider /></div>
                    <div className='p-2 flex items-center justify-between'>
                        <span>SKU:</span> <Chip>{item.sku}</Chip>
                    </div>
                    <div><Divider /></div>
                    <div className='p-2 flex items-center justify-between'>
                        <span>Category:</span> <Chip>{item.category}</Chip>
                    </div>
                  </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        </div>
        <div className='p-4 space-y-4'>
        <div className="border-1 overflow-hidden border-gray-200 shadow-lg rounded-lg">
          <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1 className='text-xl font-medium'>Payment Amount</h1>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div className='space-y-2'>
                {myCart.map((item, index) => (
                  <div key={index} className='flex items-center justify-between'>
                    <span>{item.name} x{item.quantityPurchase}:</span> <strong>Tk.{item.price * item.quantityPurchase}</strong>
                  </div>
                ))}
                <div className='flex items-center justify-between'>
                  <span className='banglaFont'>{ordersInfo?.deliveryChargeDetails?.deliveryArea} Delivery Charge:</span> 
                  <strong>Tk.{ordersInfo?.deliveryChargeDetails?.deliveryCost}</strong>
                </div>
                <Divider />
                <div className='flex items-center justify-between'>
                  <span className='banglaFont'>Total Payment:</span> <strong>Tk.{totalPayment ? totalPayment : 0}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-1 overflow-hidden border-gray-200 shadow-lg rounded-lg">
          <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1 className='text-xl font-medium'>Order Status</h1>
          </div>
          <div className="p-4 flex items-center justify-center w-full min-h-28">
           <OrderStatusChip statusKey={ordersInfo?.status}/>
          </div>
          <div >
            <form onSubmit={handleSubmit(onSubmit)} className="px-4 border-t-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
              <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Select 
                  size='sm'
                  aria-label={"Status Selector"} 
                  placeholder='Select Order Status'
                  {...register("status", { required: true })} 
                >
                  {orderStatus.map((status) => (
                    <SelectItem key={status.key}>
                      {status.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <Button isLoading={loading} isDisabled={loading} type='submit' color='primary' size='sm' radius='sm'>Update Status</Button>
            </form>
          </div>
        </div>
        <div className="border-1 overflow-hidden border-gray-200 shadow-lg rounded-lg">
          <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1 className='text-xl font-medium'>User Details</h1>
          </div>
          <div className="p-4 space-y-4">
            <h1>User Name: {ordersInfo?.fullName}</h1>
            <h1>User Phone: {ordersInfo?.phone}</h1>
          </div>
        </div>
        <div className="border-1 overflow-hidden border-gray-200 shadow-lg rounded-lg">
          <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1 className='text-xl font-medium'>Shipping Address</h1>
          </div>
          <div className="p-4 space-y-4">
            <h1 className='banglaFont text-xl'>{ordersInfo?.address}</h1>
          </div>
        </div>
        <div className="border-1 overflow-hidden border-gray-200 shadow-lg rounded-lg">
          <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1 className='text-xl font-medium'>Payment info</h1>
          </div>
          <div className="p-4 space-y-4">
            <h1>Cash on Delevery</h1>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

const OrderStatusChip = ({ statusKey }) => {
  const orderStatus = [
    {label: "New Order", key: "newOrder", colors: "danger"},
    {label: "Shipped", key: "shipped", colors: "success"},
    {label: "Delivered", key: "delivered", colors: "primary"},
    {label: "Cancelled", key: "cancelled", colors: "gray"},
    {label: "Refunded", key: "refunded", colors: "warning"},
    {label: "Returned", key: "returned", colors: "info"},
  ]

  // Find the matching status
  const status = orderStatus.find(s => s.key === statusKey);

  // Fallback if statusKey is not found
  if (!status) {
    return <Chip color="secondary" radius="lg" size="lg" variant="flat">Unknown Status</Chip>;
  }

  return (
    <Chip color={status.colors} radius="sm" size="lg" variant="flat">
      {status.label}
    </Chip>
  );
};

export default OrderDetails