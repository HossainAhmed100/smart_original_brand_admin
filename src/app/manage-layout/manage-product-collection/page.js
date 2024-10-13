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
import toast from "react-hot-toast";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";

function ManageProductCollection() {
  useEffect(() => {
    document.title = 'Manage Product Collection | Admin Dashboard | Smart Original Brand Online Shop';
  }, []);
  const [preview, setPreview] = useState('');
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedCollectionImages, setSelectedCollectionImages] = useState(null);
  const [loadingCollection, setLoadingCollection] = useState(false);
  const [productType, setProductType] = useState(new Set([]));
  const axiosSecure = useAxiosSecure();
  const router = useRouter();

  const {data: collectionInfo = [], refetch} = useQuery({
  queryKey: ["collectionInfo"],
  queryFn: async () => {
      const res = await axiosSecure.get('/layout/collection/');
      return res.data;
  },
  })

  const productTypeArr = [
      {
        id: 1,
        label: "Long Sleeve",
        path: "long-sleeve",
      },
      {
        id: 2,
        label: "V-Neck",
        path: "v-neck",
      },
      {
        id: 3,
        label: "Relaxed Fit",
        path: "relaxed-fit",
      },
      {
        id: 4,
        label: "Athletic Fit",
        path: "athletic-fit",
      },
      {
        id: 5,
        label: "Special Interest T-Shirt",
        path: "special-interest",
      },
      {
        id: 6,
        label: "Formal Shirt",
        path: "formal",
      },
      {
        id: 7,
        label: "Casual Shirt",
        path: "casual",
      },
      {
        id: 8,
        label: "Half Sleeve Shirt",
        path: "half-sleeve",
      },
      {
        id: 9,
        label: "Full Sleeve Shirt",
        path: "full-sleeve",
      },
      {
        id: 10,
        label: "Printed Shirt",
        path: "printed",
      },
      {
        id: 11,
        label: "Solid Shirt",
        path: "solid",
      },
      {
        id: 12,
        label: "Club Shirt",
        path: "club",
      },
      {
        id: 13,
        label: "Men's Polo",
        path: "mens-polo",
      },
      {
        id: 14,
        label: "Women's Polo",
        path: "womens-polo",
      },
      {
        id: 15,
        label: "Classic Fit Polo",
        path: "classic-fit",
      },
      {
        id: 16,
        label: "Long Sleeve Polo",
        path: "long-sleeve-polo",
      },
      {
        id: 17,
        label: "Pocket Polos",
        path: "pocket-polos",
      },
      {
        id: 18,
        label: "Jeans",
        path: "jeans",
      },
      {
        id: 19,
        label: "Chinos",
        path: "chinos",
      },
      {
        id: 20,
        label: "Formal Bottom",
        path: "formal-bottom",
      },
      {
        id: 21,
        label: "Joggers",
        path: "joggers",
      },
      {
        id: 22,
        label: "Cargo",
        path: "cargo",
      },
      {
        id: 23,
        label: "Shorts",
        path: "shorts",
      },
      {
        id: 24,
        label: "Pajama",
        path: "pajama",
      },
      {
        id: 25,
        label: "Gurkha Pants",
        path: "gurkha-pants",
      },
      {
        id: 26,
        label: "Blazer",
        path: "blazer",
      },
      {
        id: 27,
        label: "Jacket",
        path: "jacket",
      },
      {
        id: 28,
        label: "Sweater",
        path: "sweater",
      },
      {
        id: 29,
        label: "Sweatshirt",
        path: "sweatshirt",
      },
      {
        id: 30,
        label: "Hoodie",
        path: "hoodie",
      },
      {
        id: 31,
        label: "T-Shirt (Woman)",
        path: "t-shirt",
      }
  ];
    

  // Function to handle image selection
  const handleCollectionImageSelect = (event) => {
  const selectedFile = event.target.files[0];
  setSelectedCollectionImages(selectedFile);
  
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
  
  const getProductTypeById = (id) => {
    return productTypeArr.find((product) => product.id === id);
  };
      
  const addNewCollection = async (onClose) => {
  setLoadingCollection(true)
  if(preview === '' || productType === ''){
      Swal.fire({
      icon: "error",
      title: "Please Add Collection image and Collection Type",
      });
      setLoadingCollection(false)
      return;
    }else {
      try {
      const uploadedImage = await uploadImageAsync(selectedCollectionImages);

      const key = Math.floor(100000 + Math.random() * 900000).toString();
      const {label, path} = getProductTypeById(2);
      const newCollection = {
          key: key,
          label: label,
          path: path,
          imgUrl: uploadedImage,
      };

      const response = await axiosSecure.post('/layout/collection/', newCollection);

      if (response.status === 201) {
          Swal.fire({
          icon: "success",
          title: "Collection Added Successfully!",
          });
          refetch()
          setPreview('')
          setSelectedCollectionImages(null)
          setProductType(new Set([]))
      } else {
          Swal.fire({
          icon: "warning",
          title: "Something went wrong",
          });
      }
      } catch (err) {
      console.error('Error adding Collection to database:', err);
      } finally {
      setLoadingCollection(false)
      setSelectedCollectionImages(null)
      setProductType(new Set([]))
      onClose()
      }
  }
  }
    
  const handleDeleteCollection = async (item) => {
  
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

      const res = await axiosSecure.delete(`/layout/collection/${item._id}`);
      // Notify the user of successful deletion
      if (res.data._id === item._id) {
      refetch();
      toast.success("Collection Successfully Deleted")
      }
  } catch (error) {
      console.error('Error Deleting Collection:', error);
      toast.success("There was an error deleting the Collection. Please try again.")
  }
  };

    return (
    <section>
    <div className="mb-6">
        <Button color="default" variant="bordered" onClick={() => router.back()} startContent={<FaAngleLeft size={20}/>}>
          Go Back
        </Button>
      </div>
        <div className="border-1 border-gray-200 rounded-md">
        <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
            <div><span>Collection :</span> <span className="font-medium text-tiny">PNJ (MAX. Size 680px910px)</span></div>
            <Button onPress={onOpen} color="primary">Add Collection</Button>
        </div>
        <div className="p-4 space-y-4">
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Create a Collection</ModalHeader>
                <ModalBody>
                {
                preview ? 
                <div className="relative overflow-hidden rounded-md flex flex-col items-center justify-center w-full group">
                    <Image src={preview} width={1000} height={600} alt={"Collection Image"} className="w-full border h-44 object-contain" />
                    <Button onClick={handleRemoveImage} isIconOnly color="danger"><FaTrashAlt size={18}/></Button>
                </div> :
                <div className="flex items-center justify-center w-full">
                    <Input color="secondary" size="lg" type="file" label="Select Photo" onChange={handleCollectionImageSelect}/>
                </div>
                }
                <Select
                  isRequired
                  label="Select Product Type"
                  placeholder="Select type"
                  labelPlacement="outside"
                  variant="faded"
                  selectedKeys={productType}
                  onSelectionChange={setProductType}
                  className="w-full"
                  >
                  {productTypeArr.map((item) => (
                      <SelectItem key={item.id}>
                      {item.label}
                      </SelectItem>
                  ))}
                </Select>
                </ModalBody>
                <ModalFooter>
                <Button 
                isLoading={loadingCollection} 
                isDisabled={loadingCollection} 
                onClick={() => addNewCollection(onClose)} 
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
            collectionInfo ?     
            collectionInfo.map((item, index) => (
            <div key={index} className="p-2 border-1 max-w-96 rounded-md">
                <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                <Image src={item.imgUrl} alt={item.label} width={300} className="object-cover rounded-md" height={300}/>
                <div className="absolute inset-0 flex items-end justify-center py-4">
                    <p className="text-black bg-white w-2/4 rounded-lg p-2  font-semibold text-sm text-center">
                    {item.label}
                    </p>
                </div>
                </div>
                <Button size="sm" radius="sm" onClick={() => handleDeleteCollection(item)} className="w-full" color="danger">Delete</Button>
            </div>
            )) :
            <div className="rounded-md w-72 text-gray-900 bg-gray-300 p-4"><h1>You dont have any collection!</h1></div>
            }
            </div>
        </div>
        </div>
    </section>
    )
}

export default ManageProductCollection