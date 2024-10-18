"use client"
import { Button, Chip } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from "@/firebase/firebase.config";
import toast from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { FaRegTrashAlt } from "react-icons/fa";

function ManageBanners() {
  useEffect(() => {
    document.title = 'PWebsite Banners | Admin Dashboard | Smart Original Brand Online Shop';
  }, []);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState('');
  const router = useRouter();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  
  const {data: popupImagedb = [], refetch} = useQuery({
    queryKey: ["popupImagedb"],
    queryFn: async () => {
      const res = await axiosPublic.get('/layout/popupbannerImage');
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
    setIsLoading(true)
    if (!uploadUrl) return;
    try {
      const res = await axiosSecure.post('/layout/popupbannerImage', {image: uploadUrl})
      toast.success('Image uploaded successfully');
      refetch()
      setFile(null)
      setPreview('')
      setIsLoading(false)
    } catch (e) {
      console.error('Error adding Image:', e);
      toast.error('Error adding Image');
      setIsLoading(false)
    }
    
  }

  const handleDeleteBanner = async (id) => {
    console.log("🚀 ~ handleDeleteBanner ~ id:", id)
    try {
      await axiosPublic.delete(`/layout/popupbannerImage/${id}`)
      console.log('Image deleted successfully:', id);
      toast.success('Image deleted successfully');
      refetch()
    } catch (e) {
      console.error('Error deleting Image:', e);
      toast.error('Error deleting Image');
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
          <h1>Select Promo Banner Image</h1>
          <p className="text-xs text-gray-500">File Type PNG or JPG (MIN. 1200x1200)</p>
        </div>
        <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 p-4 gap-4">
        {
          preview && (
            <div style={{ margin: '10px 0' }}>
            <div className="p-2 border-1 max-w-96 rounded-md">
              <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
              <Image src={preview} alt={"Instagram Images Preview"} width={300} className="object-cover rounded-md" height={100}/>
              <div className="absolute top-1 right-4 flex items-end justify-center py-4">
                <Button isIconOnly onClick={() => setPreview('')} color="danger">
                  <FaRegTrashAlt size={24}/>
                </Button>
              </div>
              </div>
              <div className="flex items-center gap-2 justify-between">
              <Button size="sm" radius="sm" isLoading={isLoading} onClick={handleUpload} className="flex-1" isDisabled={uploading} color="primary">{uploading ? 'Uploading...' : 'Upload'}</Button>
              </div>
            </div>
            </div>
          ) 
        }
        {
          popupImagedb.length > 0 ? <div>
            <Chip radius="sm" variant="flat" color="warning" >Please First Delete Your Promo Banner the You See Banner Upload Options</Chip>
          </div> : 
          <div className="flex items-center justify-center w-full">
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
        <h1>Promo Banner Images</h1>
      </div>
      <div className="p-4">
        <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-4">
        {popupImagedb.map((image, index) => (
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
    <div key={index} className="p-2 border-1 max-w-96 rounded-md">
      <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
      <Image src={image.imageUrl} alt={"insta img"} width={300} className="object-cover rounded-md" height={300}/>
      </div>
      <Button size="sm" radius="sm" onClick={() => handleDeleteBanner(image._id)} className="w-full" color="danger">Delete</Button>
    </div>
  );
};


export default ManageBanners