"use client"
import { Input, Button, Select, SelectItem, Image, Textarea, ModalContent, Modal, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, CardBody, Chip, Spinner } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import Swal from "sweetalert2";
import { storage } from "@/firebase/firebase.config";
import { CloudArrowUp } from "@phosphor-icons/react";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { IoIosAddCircle } from "react-icons/io";
import toast from "react-hot-toast";

function UpdtaeProdcut({ params })  {
  useEffect(() => {
    document.title = 'Update Product Product | Admin Dashboard | Smart Original Brand Online Shop';
  }, []);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [sizeValues, setSizeValues] = useState([]);
  const [selectSizeGuide, setSelectSizeGuide] = useState('');
  const [selectedVariation, setSelectedVariation] = useState([]);
  const [productTag, setProductTag] = useState("");
  const [newProductTag, setNewProductTag] = useState([]);
  const axiosPublic = useAxiosPublic();

  const {data: sizeGuideInfo = []} = useQuery({
    queryKey: ["sizeGuideInfo"],
    queryFn: async () => {
      const res = await axiosPublic.get('/layout/sizeGuide/');
      const nondeSizeGuide = {
        _id: "none",
        name: "None",
        key: "none",
        imgUrl: "none",
      };
      const sizeGuideDatas = res.data;
      const newSizeGuide = [nondeSizeGuide, ...sizeGuideDatas];
      return newSizeGuide;
    },
  })

  const { data: productData = [], isLoading } = useQuery({
    queryKey: ['productData', params.id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products/productsById/${params.id}`);
      const morePhotos = res.data?.images;
      const ssSizes = res.data?.sizes;
      setSelectedImages([...morePhotos])
      setSizeValues([...ssSizes])
      return res.data;
    }
  });

  const {data: categoryInfo = []} = useQuery({
    queryKey: ["categoryInfo"],
    queryFn: async () => {
        const res = await axiosPublic.get('/layout/category/');
        return res.data;
    },
    })

    const onSubmit = async (data) => {
      setLoading(true);
      const { title, brand, category, description, gender } = data;
      const slug = productData.slug;
      const originalPrice = parseFloat(data.originalPrice);
      const sellingPrice = parseFloat(data.sellingPrice);
      const quantity = parseInt(data.quantity);
      const productSizes = Array.from(sizeValues);
      const variation = productData.variation;
      const sku = productData.sku;
      const tag = newProductTag ? newProductTag : [category];
      const thumbImage = productData.thumbImage;
      const images = productData.images;
      const newProduct = {
        category,
        type: category,
        name: title,
        gender,
        new: false,
        sale: false,
        rate: 5,
        price: sellingPrice,
        originPrice: originalPrice,
        brand,
        sold: 0,
        quantity,
        quantityPurchase: 0,
        sizes: productSizes,
        variation,
        thumbImage,
        images,
        description,
        action: "quick shop",
        slug,
        tag,
        sku
      };
      console.log(newProduct)

      await axiosSecure.put(`/products/${productId}`, newProduct)
    .then((response) => {
      setLoading(false)
      console.log("🚀 ~ .then ~ response:", response)
      if(response.status === 200){
        toast.success('Successfully Updated!')
        refetch()
      }
    })
    };

  const generateSlug = (name) => {
    const final = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const timestamp = Date.now();
    return `${final}-${timestamp}`;
  };

  // Function to handle product data upload to the server
  const handleProductUpload = async (data, images) => {
    setLoading(true);
    const { title, brand, category, description, gender } = data;
    const slug = generateSlug(title);
    const originalPrice = parseFloat(data.originalPrice);
    const sellingPrice = parseFloat(data.sellingPrice);
    const quantity = parseInt(data.quantity);
    const productSizes = Array.from(sizeValues);
    const variation = selectedVariation;
    const sku = data.sku;
    const tag = newProductTag ? newProductTag : [category];
    const thumbImage = [images[0], images[1]];
    const newProduct = {
      category,
      type: category,
      name: title,
      gender,
      new: false,
      sale: false,
      rate: 5,
      price: sellingPrice,
      originPrice: originalPrice,
      brand,
      sold: 0,
      quantity,
      quantityPurchase: 0,
      sizes: productSizes,
      variation,
      thumbImage,
      images,
      description,
      action: "quick shop",
      slug,
      tag,
      sku
    };
    console.log(newProduct)
    try {
      const response = await axiosPublic.post('/products/addnewProduct', newProduct);
      if (response.status === 201) {
        setSelectedImages([])
        setSelectedVariation([])
        setNewProductTag([])
        setProductTag("")
        reset()
        Swal.fire({
          icon: "success",
          title: "Product Added Successfully!",
        })
      } else {
        Swal.fire({
          icon: "warning",
          title: "Something went wrong",
        });
      }
    } catch (err) { 
      console.error('Error adding product to database:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to upload image to Firebase
  const uploadImageAsync = async (file) => {
    try {
        // Use the file directly as it's already a Blob
        const fileRef = ref(storage, `image/image-${Date.now()}-${file.name}`);
        await uploadBytes(fileRef, file);
        console.log("Uploaded file:", fileRef);
        return await getDownloadURL(fileRef);
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
  };

  const sizeArrays = [
    {key: "xs", label: "XS"},
    {key: "s", label: "S"},
    {key: "m", label: "M"},
    {key: "l", label: "L"},
    {key: "xl", label: "XL"},
    {key: "xxl", label: "XXL"},
    {key: "3xl", label: "3XL"},
  ];

  const genderArray = [
    {key: "male", label: "Male"},
    {key: "female", label: "Female"}
  ];

  const handleAddProductTag = () => {
    if(productTag){
      const final = productTag.replace(/\s+/g, '').toLowerCase();
      const newTag = [...newProductTag, final];
      setNewProductTag(newTag)
      setProductTag("")
    }else{
      toast.error("Please Write Product Tag First!")
    }
  }

  const handleDeleteProductTag = (itemToRemove) => {
    setNewProductTag(newProductTag.filter(item => item !== itemToRemove));
    if (newProductTag.length === 1) {
      setNewProductTag([]);
    }
    toast.success('Removed Successfully!');
  }

  
  if(isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="xl" className="animate-spin" /></div>
  }

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">

        {/* General Information Form Section */}
        <div className="border-1 border-gray-200 rounded-md overflow-hidden">
        <div className="px-4 border-b-1 gap-2 py-2 flex flex-col md:flex-row bg-gray-700 items-center justify-between">
          <h1 className="text-white">General Information</h1>
          <p className="text-xs text-white">Fill in the product details below</p>
        </div>
        <div className="p-4 space-y-4">
          <Input {...register("title", { required: true })} 
          labelPlacement="outside" 
          variant="faded" radius="sm" 
          label="Product Name" 
          defaultValue={productData?.name}
          placeholder="Enter product name" fullWidth />
          {errors.title && <span className="text-tiny text-red-500">This field is required</span>}
          <div className="grid grid-cols-2 gap-4">
            <div>
            <Input {...register("brand", { required: true })} 
            labelPlacement="outside" 
            variant="faded" radius="sm" 
            label="Product Brand"
            defaultValue={productData?.brand} 
            placeholder="Type Brnad name" fullWidth />
            {errors.brand && <span className="text-tiny text-red-500">This field is required</span>}
            </div>
            <div>
            <Select {...register("category", { required: true })} 
              label="Product Category" 
              labelPlacement="outside" 
              variant="faded" radius="sm" 
              placeholder="Select a Category" fullWidth>
              {categoryInfo.map((category) => (
                <SelectItem className="text-medium" key={category.key} textValue={category.label}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
            {errors.category && <span className="text-tiny text-red-500">This field is required</span>}
            </div>
          </div>
        </div>
        </div>

        {/* Size Section */}
        <div className="border-1 border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 border-b-1 gap-2 bg-gray-700 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-white">Select Sizes</h1>
            <p className="text-xs text-white">Select the available product sizes</p>
          </div>
          <div className="p-4 space-y-4">
          
          <div className="grid grid-cols-3 gap-4">
            <div>
            <Select 
              selectionMode="multiple"
              label="Select Product Sizes"
              labelPlacement="outside" 
              variant="faded" radius="sm"
              {...register("productSize", { required: true })}  
              selectedKeys={sizeValues}
              onSelectionChange={setSizeValues}
              placeholder="Select Sizes Guide" fullWidth>
              {sizeArrays.map((sizeArray) => (
                <SelectItem key={sizeArray.key} textValue={sizeArray.label}>
                  {sizeArray.label}
                </SelectItem>
              ))}
            </Select>
            {errors.productSize && <span className="text-tiny text-red-500">This field is required</span>}
            </div>
            <div>
            <Select 
              label="Select Size Guide"
              labelPlacement="outside" 
              variant="faded" radius="sm" 
              {...register("sizeGuide", { required: true })} 
              onSelectionChange={setSelectSizeGuide}
              placeholder="Select Size Guide" fullWidth>
              {sizeGuideInfo.map((item) => (
                <SelectItem key={item.imgUrl} textValue={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </Select>
            {errors.sizeGuide && <span className="text-tiny text-red-500">This field is required</span>}
            </div>
            <div>
            <Select {...register("gender", { required: true })} 
              label="Select Gender" 
              labelPlacement="outside" 
              variant="faded" radius="sm" 
              placeholder="Select a Gender" fullWidth>
              {genderArray.map((gender) => (
                <SelectItem className="text-medium" key={gender.key} textValue={gender.label}>
                  {gender.label}
                </SelectItem>
              ))}
            </Select>
            {errors.gender && <span className="text-tiny text-red-500">This field is required</span>}
          </div>
          </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="border-1 border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 border-b-1 gap-2 py-2 bg-gray-700 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-white">Pricing</h1>
            <p className="text-xs text-white">Enter the product pricing details</p>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4">
            <div>
            <Input
              type="number"
              label="Original Price"
              variant="faded" 
              placeholder="0.00"
              min={1}
              defaultValue={productData.originPrice}
              labelPlacement="outside"
              {...register("originalPrice", { required: true })}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">৳</span>
                </div>
              }
            />
            {errors.originalPrice && <span className="text-tiny text-red-500">This field is required</span>}
            </div>
            <div>
              <Input 
                type="number" 
                min={1}
                defaultValue={productData.price}
                startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">৳</span>
                </div>
                } 
                {...register("sellingPrice", { required: true })} 
                labelPlacement="outside" 
                variant="faded" radius="sm" 
                label="Selling Price" placeholder="0.00" fullWidth />
              {errors.sellingPrice && <span className="text-tiny text-red-500">This field is required</span>}
            </div>
          </div>
        </div>
        
        {/* Inventory Section */}
        <div className="border-1 border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 border-b-1 gap-2 bg-gray-700 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-white">Inventory</h1>
            <p className="text-xs text-white">Enter the inventory details</p>
          </div>
          <div className="p-4 grid md:grid-cols-2 grid-cols-1 gap-4">
            <div>
            <Input
              type="number"
              min={1}
              label="Prodcut Code"
              variant="faded" 
              defaultValue={productData.sku}
              placeholder="12345678"
              labelPlacement="outside"
              {...register("sku", { required: true })}
            />
            {errors.sku && <span className="text-tiny text-red-500">This field is required</span>}
            </div>
            <div>
            <Input
              type="number"
              label="Prodcut Stock Quantity"
              variant="faded" 
              defaultValue={productData.quantity}
              min={1}
              placeholder="Type product quantity"
              labelPlacement="outside"
              {...register("quantity", { required: true })}
            />
            {errors.quantity && <span className="text-tiny text-red-500">This field is required</span>}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="border-1 border-gray-200 overflow-hidden rounded-md">
        <div className="px-4 border-b-1 gap-2 bg-gray-700 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-white">Product Description</h1>
            <p className="text-xs text-white">Type product details</p>
          </div>
          <div className="p-4">
            <div>
              <Textarea
                type="description"
                label="Description"
                variant="faded" 
                defaultValue={productData.description}
                placeholder="Write about your product"
                labelPlacement="outside"
                {...register("description", { required: true })}
              />
              {errors.description && <span className="text-tiny text-red-500">This field is required</span>}
            </div>
          </div>
        </div>

        {/* Product Tag Section */}
        <div className="border-1 border-gray-200 overflow-hidden rounded-md">
        <div className="px-4 border-b-1 gap-2 bg-gray-700 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-white">Product Tag</h1>
            <p className="text-xs text-white">Type Product Tag for SEO</p>
          </div>
          <div className="p-4">
          <div>
            <div>
              <h1 className="mb-2">Add Product Tag Here</h1>
              <div className="flex justify-center gap-3">
              <Input
              radius="sm"
              type="text"
              variant="bordered"
              placeholder="Example.. PoloShirt, T-Shirt, Tor"
              value={productTag}
              onValueChange={setProductTag}
              errorMessage="Please Type Stayle Name"
              className="flex-1"
              />
              <Button startContent={<IoIosAddCircle size={20} />} onPress={handleAddProductTag} color="primary">
                Add
              </Button> 
              </div>
            </div>
          </div>
          <Card className="shadow-none border-1 border-gray-300">
          <CardBody className="p-6 min-h-60 flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
            {newProductTag.map((name, index) => (
              <Chip key={index} onClose={() => handleDeleteProductTag(name)} variant="flat">
              {name}
              </Chip>
            ))}
            </div>
          </CardBody>
        </Card>
          </div>
        </div>

        <Button isLoading={loading} disabled={loading} type="submit" color="primary">Add Product</Button>
      </div>
      </form>
    </section>
  );
}



export default UpdtaeProdcut;