"use client"
import { useForm } from "react-hook-form";
import { Button, Divider, Input, Spinner } from "@nextui-org/react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from 'react-hot-toast';
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { auth } from "@/firebase/firebase.config";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function MyProfile() {
  const [user] = useAuthState(auth);
  const [laoding, setLoading] = useState(false)
  const axiosSecure = useAxiosSecure();

  const {data: userData = [], refetch, isLoading} = useQuery({
    queryKey: ["userData", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${user?.email}`);
      return response.data;
    }
  })

  const {_id, name, email, phone, address} = userData;

  // Hook to manage form state, validation, and submission handling
  const { register, handleSubmit, formState: { errors } } = useForm({defaultValues:{name: name, phone: phone, address: address}});

  // Form submission handler
  const onSubmit = async (data) => {
    setLoading(true)
    const info = {name: data.name, phone: data.phone, address: data.address};
    await axiosSecure.put(`/users/${_id}`, info)
     .then((response) => {
        if(response.status === 200){
          refetch()
          toast.success('Successfully Updated!')
          setLoading(false)
        }
      })
  };

  if(isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="xl" className="animate-spin" /></div>
  }
  
  return (
    <div className="w-full">
      <div className="flex items-center md:flex-row flex-col justify-start gap-4">
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-xl font-semibold text-gray-800">{name && name}</h1>
            <div className="flex sm:items-center items-start justify-start gap-3 md:flex-row flex-col">
              <span className="text-gray-500">{email && email}</span>
              <span className="text-gray-500">{phone && phone}</span>
            </div>
          </div>
        </div>
        <Divider className="my-8 bg-[#F0EFEF]"/>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-3 grid-cols-1 gap-4">
        <div className="flex min-w-full flex-col gap-6 md:col-span-2">
          <div className="flex gap-4 md:flex-row flex-col">
            <div className="flex-1">
              <Input
                isRequired
                radius="sm"
                size="lg"
                type="text"
                name="name"
                label="Full Name"
                className="w-full"
                variant="faded"
                labelPlacement="outside"
                placeholder="Type your Full Name"
                {...register("name", { required: "Please enter your Name" })}
                color={errors.name ? "danger" : "default"}
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>
          </div>
          <div className="flex gap-4 md:flex-row flex-col">
            <div className="flex-1">
              <Input
                startContent={
                  <div className="border-r-2 pr-2 flex items-center justify-start gap-1">
                    <span className="text-[14px] font-medium text-gray-600">+880</span>
                  </div>
                }
                isRequired
                radius="sm"
                size="lg"
                type="tel"
                name="phone"
                label="Phone"
                className="w-full"
                variant="faded"
                labelPlacement="outside"
                placeholder="018-0000-0000"
                {...register("phone", { required: "Please enter your Phone", pattern: {
                  value: /^[0-9]{11}$/,
                  message: "Phone number must be exactly 11 digits"
                }})}
                color={errors.phone ? "danger" : "default"}
              />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
            </div>
          </div>
          <Input
            isRequired
            radius="sm"
            size="lg"
            type="text"
            name="address"
            label="Address"
            className="w-full"
            variant="faded"
            labelPlacement="outside"
            placeholder="Type your Full Name"
            {...register("address", { required: "Please enter your Name" })}
            color={errors.address ? "danger" : "default"}
          />
          {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
          <Button type="submit" className="bg-gray-900 w-44 text-white shadow-lg">Save Changes</Button>
        </div>
        </form>
      </div>
      {/* <Divider className="my-16"/>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div className="p-4 rounded-md border border-default-300 flex items-start justify-between gap-2">
          <div className="gap-2">
            <h4 className="text-base font-semibold text-gray-800">Password</h4>
            <span className="text-tiny font-normal text-default-400">You can change or reset your password bt clicking here</span>
          </div>
          <Button isLoading={laoding} isDisabled={laoding} color="primary" size="sm" variant="flat">
            Change
          </Button> 
        </div>
      </div> */}
    </div>
  )
}

