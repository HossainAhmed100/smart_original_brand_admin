"use client"
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react"
import { useQuery } from "@tanstack/react-query";
import Image from "next/image"
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/firebase/firebase.config";
import Swal from "sweetalert2";

function ManageSizeguide() {
  useEffect(() => {
    document.title = 'Manage Size Guide | Admin Dashboard | Zero Exclusive Online Shop';
  }, []);
  const [sizeGuideName, setSizeGuideName] = useState("");
  const [preview, setPreview] = useState('');
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedSizeGuideImages, setSelectedSizeGuideImages] = useState(null);
  const [loadingUplaodSizeGuide, setLoadingUplaodSizeGuide] = useState(false);
  const axiosSecure = useAxiosSecure();

  const {data: sizeGuideInfo = [], refetch} = useQuery({
    queryKey: ["sizeGuideInfo"],
    queryFn: async () => {
      const res = await axiosSecure.get('/layout/sizeGuide/');
      return res.data;
    },
  })

  // Function to handle image selection
  const handleSizeGuideImageSelect = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedSizeGuideImages(selectedFile);
    
    // Generate a preview URL for the selected image
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {setPreview('');};

  // Function to upload image to Firebase
  const uploadImageAsync = async (file) => {
    try {
      // Use the file directly as it's already a Blob
      const fileRef = ref(storage, `lauoytImages/image-${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      console.log("Uploaded file:", fileRef);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

    
  const addNewSizeGuide = async (onClose) => {
    setLoadingUplaodSizeGuide(true)
    if(preview === '' || sizeGuideName === ''){
      Swal.fire({
        icon: "error",
        title: "Please Add Size Guide image and Select Category",
      });
      setLoadingUplaodSizeGuide(false)
      return;
    }else {
      try {
        const uploadedImage = await uploadImageAsync(selectedSizeGuideImages);

        const key = Math.floor(100000 + Math.random() * 900000).toString();

        const newSizeGuide = {
          key: key,
          name: sizeGuideName,
          imgUrl: uploadedImage,
        };

        const response = await axiosSecure.post('/layout/sizeGuide/', newSizeGuide);

        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Size Guide  Added Successfully!",
          });
          refetch()
          setPreview('')
          setSelectedSizeGuideImages(null)
        } else {
          Swal.fire({
            icon: "warning",
            title: "Something went wrong",
          });
        }
      } catch (err) {
        console.error('Error adding Size Guide to database:', err);
      } finally {
        setLoadingUplaodSizeGuide(false)
        setSelectedSizeGuideImages(null)
        setSizeGuideName("")
        onClose()
      }
   }
  }

  
  const handleDeleteSizeGuide = async (item) => {
  
    const imageUrl = item.imgUrl;
  
    try {
      // Extract the file path from the image URL
      // Firebase Storage URLs are typically in the format:
      // https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<path>?alt=media&token=<token>
      const decodedPath = decodeURIComponent(
        imageUrl.split('/o/')[1].split('?')[0]
      );
  
      // Create a reference to the file in Firebase Storage
      const storageRefPath = ref(storage, decodedPath);
  
      // Delete the file from Firebase Storage
      await deleteObject(storageRefPath);

      const res = await axiosSecure.delete(`/layout/sizeGuide/${item._id}`);
      // Notify the user of successful deletion
      if (res.data._id === item._id) {
        refetch();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Size Guide Successfully Deleted",
        });
      }
    } catch (error) {
      console.error('Error Deleting Size Guide:', error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "There was an error deleting the Size Guide. Please try again.",
      });
    }
  };


  return (
    <section>
      <div className="border-1 border-gray-200 rounded-md">
        <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
            <div><span>Size Guide :</span> <span className="font-medium text-tiny">JPG (MAX. 1024x300px)</span></div>
            <Button onPress={onOpen} color="primary">Add Size Guide</Button>
        </div>
        <div className="p-4 space-y-4">
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
            <ModalContent>
            {(onClose) => (
              <>
              <ModalHeader className="flex flex-col gap-1">Create a Size Guide</ModalHeader>
              <ModalBody>
                {
                preview ? 
                <div className="relative overflow-hidden rounded-md flex flex-col items-center justify-center w-full group">
                  <Image src={preview} width={1000} height={1000} alt={"Size Guide Image"} className="w-full border h-44 object-contain" />
                  <Button onClick={handleRemoveImage} isIconOnly color="danger"><FaTrashAlt size={18}/></Button>
                </div> :
                <div className="flex items-center justify-center w-full">
                  <Input color="secondary" size="lg" type="file" label="Select Photo" onChange={handleSizeGuideImageSelect}/>
                </div>
                }
                <Input
                  autoFocus
                  label="Type Size Name"
                  placeholder="Enter size guide name"
                  labelPlacement="outside"
                  variant="bordered"
                  value={sizeGuideName}
                  onValueChange={setSizeGuideName}
                />
              </ModalBody>
              <ModalFooter>
                <Button 
                isLoading={loadingUplaodSizeGuide} 
                isDisabled={loadingUplaodSizeGuide} 
                onClick={() => addNewSizeGuide(onClose)} 
                className="w-full" color="primary">
                Add
                </Button>
              </ModalFooter>
              </>
            )}
            </ModalContent>
          </Modal>
          <div className="gap-4 flex items-center justify-start">
            {
            sizeGuideInfo.map((item, index) => (
            <div key={index} className="p-2 border-1 rounded-md">
              <div className="py-4"> 
              <Image priority={true} src={item.imgUrl} alt={item.name} width={300} className="object-cover" height={300}/>
              </div>
              <div className="rounded-md w-full p-2 text-center ">
              <p className="text-base font-medium capitalize">{item.name}</p>
              </div>
              <Button size="sm" radius="sm" onClick={() => handleDeleteSizeGuide(item)} className="w-full" color="danger">Delete</Button>
            </div>
            ))
            }
            {!sizeGuideInfo && 
            <div className="rounded-md w-72 text-gray-900 bg-gray-300 p-4"><h1>You dont have any size guide!</h1></div>
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default ManageSizeguide