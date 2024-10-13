"use client"
import { Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Trash } from "@phosphor-icons/react";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

function ManageDeliveryCharge() {
    useEffect(() => {
        document.title = 'Delivery Charges | Admin Dashboard | Smart Original Brand Online Shop';
      }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState('');
  const [deliveryArea, setDeliveryArea] = useState("");
  const axiosSecure = useAxiosSecure();
  const router = useRouter();
  
  const {data: deliveryChargeInfo = [], refetch: fetchDeliveryCharge} = useQuery({
    queryKey: ["deliveryChargeInfo"],
    queryFn: async () => {
      const res = await axiosSecure.get('/layout/deliveryCharge');
      return res.data;
    },
  })

  const handleDeleteDelivery = async (id) => {
    try {
      await axiosSecure.delete(`/layout/deliveryCharge/${id}`)
      console.log('Product deleted successfully:', id);
      toast.success('Image deleted successfully');
      fetchDeliveryCharge()
    } catch (e) {
      console.error('Error deleting product:', e);
      toast.error('Error deleting product');
    }
  }

  const handleAddDeliveryOption = async () => {
    setIsLoading(true)
    if(deliveryArea === '' || deliveryArea === ''){
      toast.error('Please enter both delivery area and cost')
      setIsLoading(false)
    } else {
      const area = deliveryArea;
      const cost = parseInt(deliveryCost);
      try {
        setIsLoading(true)
        const res = await axiosSecure.post('/layout/deliveryCharge', {area, cost})
        console.log("🚀 ~ handleAddDeliveryOption ~ res:", res)
        console.log('Product added successfully:', res.data);
        toast.success('Delivery Option added successfully');
        setDeliveryArea('')
        setDeliveryCost(0)
        fetchDeliveryCharge()
        setIsLoading(false)
      } catch (e) {
        setIsLoading(false)
        console.error('Error adding delivery option:', e);
      }
    }
  }

  return (
    <section>
      <div className="mb-6">
        <Button color="default" variant="bordered" onClick={() => router.back()} startContent={<FaAngleLeft size={20}/>}>
          Go Back
        </Button>
      </div>
      <div className="space-y-5">
        <div className="border-1 border-gray-200 rounded-md">
          <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1>Dalevery Charge</h1>
          </div>
          <div className="p-4">
          <div className="flex items-end   justify-normal gap-4">
            <Input
              label="Delivery Area"
              placeholder="Type Area"
              value={deliveryArea}
              labelPlacement="outside"
              onValueChange={setDeliveryArea}
              className="max-w-xs"
              type="text"
              variant="faded"
            />
            <Input
              label="Delivery Cost"
              placeholder="Enter Amount"
              value={deliveryCost}
              labelPlacement="outside"
              onValueChange={setDeliveryCost}
              className="max-w-xs"
              type="number"
              variant="faded"
            />
            <Button isLoading={isLoading} isDisabled={isLoading} onClick={handleAddDeliveryOption} color="primary">Add  Delivery Option</Button>
          </div>
          </div>
          <div className="p-4">
          <Table isStriped aria-label="Example table with dynamic content">
            <TableHeader>
              <TableColumn key={"deliveryArea"}>{"Delivery Area"}</TableColumn>
              <TableColumn key={"deliveryCost"}>{"Delivery Cost"}</TableColumn>
              <TableColumn key={"actions"}>{"Actions"}</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No items to display."}>
              {deliveryChargeInfo.map(item => (
                <TableRow key={item._id}>
                  <TableCell>{item?.deliveryArea}</TableCell>
                  <TableCell>{item?.deliveryCost}</TableCell>
                  <TableCell>
                    <Button isLoading={isLoading} size="md" variant="light" isIconOnly 
                    onClick={() => handleDeleteDelivery(item._id)} 
                    isDisabled={isLoading} color="danger">
                      <Trash size={24} weight="light" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </div>
      </div>
    </section>
  )
}


export default ManageDeliveryCharge