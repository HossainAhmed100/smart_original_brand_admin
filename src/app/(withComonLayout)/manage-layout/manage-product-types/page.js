"use client"
import { Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Trash } from "@phosphor-icons/react";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

function ManageProductTypes() {
    useEffect(() => {
        document.title = 'Delivery Charges | Admin Dashboard | Smart Original Brand Online Shop';
      }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [productType, setProductType] = useState("");
  const axiosSecure = useAxiosSecure();
  const router = useRouter();
  
  const {data: productTypesInfo = [], refetch: fetchProductTypes} = useQuery({
    queryKey: ["productTypesInfo"],
    queryFn: async () => {
      const res = await axiosSecure.get('/layout/productTypes');
      return res.data;
    },
  })

  const handleDeleteDelivery = async (id) => {
    try {
      await axiosSecure.delete(`/layout/productTypes/${id}`)
      toast.success('Product Type deleted successfully');
      fetchProductTypes()
    } catch (e) {
      toast.error('Error deleting product type');
    }
  }

  const convertToKebabCase = (str) => {
    return str.split(' ').join('-').toLowerCase();
  };

  const handleAddProductType = async () => {
    setIsLoading(true)
    if(productType === ''){
      toast.error('Please enter Product Type')
      setIsLoading(false)
    } else {
      const label = productType;
      const path = convertToKebabCase(productType);
      console.log(label, path)
      try {
        setIsLoading(true)
        const res = await axiosSecure.post('/layout/productTypes', {label, path})
        console.log('Product Type added successfully:', res.data);
        toast.success('Product Type added successfully');
        setProductType('')
        fetchProductTypes()
        setIsLoading(false)
      } catch (e) {
        setIsLoading(false)
        console.error('Error adding Product Type:', e);
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
            <h1>Product Type</h1>
          </div>
          <div className="p-4">
          <div className="flex items-end   justify-normal gap-4">
            <Input
              label="Product Type"
              placeholder="Write Product Type"
              value={productType}
              labelPlacement="outside"
              onValueChange={setProductType}
              className="max-w-xs"
              type="text"
              variant="faded"
            />
            <Button isLoading={isLoading} isDisabled={isLoading} onClick={handleAddProductType} color="primary">Add  Product Types</Button>
          </div>
          </div>
          <div className="p-4">
          <Table isStriped aria-label="Example table with dynamic content">
            <TableHeader>
              <TableColumn key={"label"}>{"Product Type"}</TableColumn>
              <TableColumn key={"path"}>{"Product Type Path"}</TableColumn>
              <TableColumn key={"actions"}>{"Actions"}</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No items to display."}>
              {productTypesInfo.map(item => (
                <TableRow key={item._id}>
                  <TableCell>{item?.label}</TableCell>
                  <TableCell>{item?.path}</TableCell>
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


export default ManageProductTypes