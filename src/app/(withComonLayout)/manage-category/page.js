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

function ManageCategory() {
    useEffect(() => {
        document.title = 'Manage Category | Admin Dashboard | Smart Original Brand Online Shop';
      }, []);
    const [categoryName, setCategoryName] = useState("");
    const [preview, setPreview] = useState('');
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [selectedCategoryImages, setSelectedCategoryImages] = useState(null);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const axiosSecure = useAxiosSecure();

    const {data: categoryInfo = [], refetch} = useQuery({
    queryKey: ["categoryInfo"],
    queryFn: async () => {
        const res = await axiosSecure.get('/layout/category/');
        return res.data;
    },
    })

    // Function to handle image selection
    const handleCategoryImageSelect = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedCategoryImages(selectedFile);
    
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
    
        
    const addNewCategory = async (onClose) => {
    setLoadingCategory(true)
    if(preview === '' || categoryName === ''){
        Swal.fire({
        icon: "error",
        title: "Please Add Category image and Category Name",
        });
        setLoadingCategory(false)
        return;
    }else {
        try {
        const uploadedImage = await uploadImageAsync(selectedCategoryImages);

        const key = Math.floor(100000 + Math.random() * 900000).toString();
        const categoryNameWithoutSpace = categoryName.replace(/\s+/g, '');

        const newCategory = {
            key: key,
            label: categoryName,
            path: categoryNameWithoutSpace,
            imgUrl: uploadedImage,
        };

        const response = await axiosSecure.post('/layout/category/', newCategory);

        if (response.status === 201) {
            Swal.fire({
            icon: "success",
            title: "Category Added Successfully!",
            });
            refetch()
            setPreview('')
            setSelectedCategoryImages(null)
        } else {
            Swal.fire({
            icon: "warning",
            title: "Something went wrong",
            });
        }
        } catch (err) {
        console.error('Error adding Category to database:', err);
        } finally {
        setLoadingCategory(false)
        setSelectedCategoryImages(null)
        setCategoryName("")
        onClose()
        }
    }
    }
    
      
    const handleDeleteCategory = async (item) => {
    
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

        const res = await axiosSecure.delete(`/layout/category/${item._id}`);
        // Notify the user of successful deletion
        if (res.data._id === item._id) {
        refetch();
        toast.success("Category Successfully Deleted")
        }
    } catch (error) {
        console.error('Error Deleting Category:', error);
        toast.success("There was an error deleting the Category. Please try again.")
    }
    };
    return (
    <section>
        <div className="border-1 border-gray-200 rounded-md">
        <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
            <div><span>Category :</span> <span className="font-medium text-tiny">PNJ (MAX. Size 300px300px)</span></div>
            <Button onPress={onOpen} color="primary">Add Category</Button>
        </div>
        <div className="p-4 space-y-4">
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Create a Category</ModalHeader>
                <ModalBody>
                {
                preview ? 
                <div className="relative overflow-hidden rounded-md flex flex-col items-center justify-center w-full group">
                    <Image src={preview} width={1000} height={1000} alt={"Category Image"} className="w-full border h-44 object-contain" />
                    <Button onClick={handleRemoveImage} isIconOnly color="danger"><FaTrashAlt size={18}/></Button>
                </div> :
                <div className="flex items-center justify-center w-full">
                    <Input color="secondary" size="lg" type="file" label="Select Photo" onChange={handleCategoryImageSelect}/>
                </div>
                }
                <Input
                    autoFocus
                    label="Type Category Name"
                    placeholder="Enter Category name"
                    labelPlacement="outside"
                    variant="bordered"
                    value={categoryName}
                    onValueChange={setCategoryName}
                />
                </ModalBody>
                <ModalFooter>
                <Button 
                isLoading={loadingCategory} 
                isDisabled={loadingCategory} 
                onClick={() => addNewCategory(onClose)} 
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
            categoryInfo ?     
            categoryInfo.map((item, index) => (
            <div key={index} className="p-2 border-1 max-w-96 rounded-md">
                <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                <Image src={item.imgUrl} alt={item.label} width={300} className="object-cover rounded-md" height={300}/>
                <div className="absolute inset-0 flex items-end justify-center py-4">
                    <p className="text-black bg-white w-2/4 rounded-lg p-2  font-semibold text-sm text-center">
                    {item.label}
                    </p>
                </div>
                </div>
                <Button size="sm" radius="sm" onClick={() => handleDeleteCategory(item)} className="w-full" color="danger">Delete</Button>
            </div>
            )) :
            <div className="rounded-md w-72 text-gray-900 bg-gray-300 p-4"><h1>You dont have any category!</h1></div>
            }
            </div>
        </div>
        </div>
    </section>
    )
}

export default ManageCategory