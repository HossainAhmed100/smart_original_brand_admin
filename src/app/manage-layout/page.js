"use client"
import { Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from "@/firebase/firebase.config";
import toast from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { Trash } from "@phosphor-icons/react";

function ManageLayout() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState('');
  const [deliveryArea, setDeliveryArea] = useState("");
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState('');
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  
  const {data: bannerImages = [], refetch} = useQuery({
    queryKey: ["bannerImages"],
    queryFn: async () => {
      const res = await axiosPublic.get('/layout/homepagebanner');
      return res.data;
    },
  })
  
  const {data: deliveryChargeInfo = [], refetch: fetchDeliveryCharge} = useQuery({
    queryKey: ["deliveryChargeInfo"],
    queryFn: async () => {
      const res = await axiosSecure.get('/layout/deliveryCharge');
      return res.data;
    },
  })

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Generate a preview URL for the selected image
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };
  
  const handleUpload = () => {
    setIsLoading(true)
    if (!file) return;

    const storageRef = ref(storage, `lauoytImages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error('Upload failed:', error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at:', downloadURL);
          setUrl(downloadURL);
          setUploading(false);
          uploadtoDatabase(downloadURL)
          setIsLoading(false)
        });
      }
    );
  };

  const uploadtoDatabase = async (uploadUrl) => {
    console.log("🚀 ~ uploadtoDatabase ~ uploadUrl:", uploadUrl)
    setIsLoading(true)
    if (!uploadUrl) return;
    try {
      const res = await axiosSecure.post('/layout/homePagebanner', {image: uploadUrl})
      console.log('Product added successfully:', res.data);
      toast.success('Image uploaded successfully');
      refetch()
      setFile(null)
      setPreview('')
      setIsLoading(false)
    } catch (e) {
      console.error('Error adding product:', e);
      toast.error('Error adding product');
      setIsLoading(false)
    }
    
  }

  const handleDeleteBanner = async (id) => {
    console.log("��� ~ handleDeleteBanner ~ id:", id)
    try {
      await axiosSecure.delete(`/layout/homePageBanner/${id}`)
      console.log('Product deleted successfully:', id);
      toast.success('Image deleted successfully');
      refetch()
    } catch (e) {
      console.error('Error deleting product:', e);
      toast.error('Error deleting product');
    }
  }

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

        <div className="border-1 border-gray-200 rounded-md">
          <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1>Select Banner Image</h1>
            <p className="text-xs text-gray-500">File Type PNG (MIN. 1200x480)</p>
          </div>
          <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 p-4 gap-4">
          {
            preview ? (
              <div style={{ margin: '10px 0' }}>
                <p>Image Preview:</p>
                <Image src={preview} alt="Preview" width={300} height={100}/>
                <Button isLoading={isLoading} onClick={handleUpload} isDisabled={uploading} color="primary">{uploading ? 'Uploading...' : 'Upload'}</Button>
              </div>
            ) : <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <div className="mb-2 text-tiny text-gray-500">
                  <p className="font-semibold">Click to upload</p>
                </div>
              </div>
              <input 
              id="dropzone-file" 
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleFileChange}  
              type="file" className="hidden" />
            </label>
          </div>
          }
          </div>
        </div>
        <div className="border-1 border-gray-200 rounded-md">
          <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1>Banner Images</h1>
          </div>
          <div className="p-4">
          <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-4">
          {bannerImages.map((image, index) => (
              <SelectedImagePreview 
                key={image?._id}
                handleDeleteBanner={handleDeleteBanner}
                image={image}
                index={index}
              />
            ))}
          </div>
          </div>
        </div>
       
      </div>
    </section>
  )
}



// Component for displaying selected image previews with replace and remove buttons
const SelectedImagePreview = ({ image, index, handleDeleteBanner }) => {
  return (
    <div className="overflow-hidden rounded-md flex flex-col items-center justify-center w-full border-1  group">
       <Image radius="md" src={image?.imageUrl} alt={index} width={250} height={50} loading="lazy" className="w-full h-44 object-contain" />
       <Button onClick={() => handleDeleteBanner(image._id)} className="w-full" radius="none" color="primary">Delete image</Button>
    </div>
  );
};


export default ManageLayout