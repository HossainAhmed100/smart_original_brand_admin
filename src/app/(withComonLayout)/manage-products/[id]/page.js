"use client"
import { Input, Button, Select, SelectItem, Textarea, Spinner } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function ManageUpdateProduct({params}) {
  const upProductId = params.id;
  useEffect(() => {
    document.title = 'Update Products | Admin Dashboard | Smart Original Brand Online Shop';
  }, []);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [sizeValues, setSizeValues] = useState([]);
  const [selectSizeGuide, setSelectSizeGuide] = useState('');
  const [prGender, setPrGender] = useState("");
  const [prCategory, setPrcategory] = useState("");
  const [prType, setPrtype] = useState("");
  const router = useRouter();
  const axiosPublic = useAxiosPublic();



  const {data: productTypesInfo = []} = useQuery({
    queryKey: ["productTypesInfo"],
    queryFn: async () => {
      const res = await axiosPublic.get('/layout/productTypes');
      return res.data;
    },
  })
  
  const { data: productMain, isLoading } = useQuery({
    queryKey: ["productMain", upProductId],
    queryFn: async () => {
        const res = await axiosPublic.get(`/products/productsById/${upProductId}`);
        const resGender = res.data.gender;
        const resprtype = res.data.type;
        const resprcategory = res.data.category;
        const resprsize = res.data.sizes;
        const resprsizeGuide = res.data.sizeGuide;
        setPrGender(resGender);
        setPrtype(resprtype);
        setPrcategory(resprcategory);
        setSelectSizeGuide(resprsizeGuide);
        setSizeValues(resprsize);
        return res.data;
    },
    enabled: !!upProductId,  // Only fetch data if productId exists
  });

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

  
  const {data: categoryInfo = []} = useQuery({
    queryKey: ["categoryInfo"],
    queryFn: async () => {
        const res = await axiosPublic.get('/layout/category/');
        return res.data;
    },
    })
    

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await handleProductUpload(data);
    } catch (error) {
        console.error('Error during product add:', error);
    } finally {
        setLoading(false);
    }
  };

  // Function to handle product data upload to the server
  const handleProductUpload = async (data) => {
    setLoading(true);
    const { title, description, brand, sku } = data;
    const brandData = brand;
    const genderData = prGender;
    const sizeGuideData = selectSizeGuide;
    const slug = productMain.slug;
    const path = prType;
    const images = productMain.images;
    const category = prCategory;
    const originalPrice = parseFloat(data.originalPrice);
    const sellingPrice = parseFloat(data.sellingPrice);
    const quantity = parseInt(data.quantity);
    const productSizes = Array.from(sizeValues);
    const variation = productMain.variation;
    const tag = productMain.tag;
    const thumbImage = productMain.thumbImage;
    const newProduct = {
      category,
      type: path,
      name: title,
      gender: genderData,
      new: false,
      sale: false,
      rate: 5,
      price: sellingPrice,
      originPrice: originalPrice,
      brand: brandData,
      sizeGuide: sizeGuideData,
      sold: productMain.sold,
      quantity,
      quantityPurchase: productMain.quantityPurchase,
      sizes: productSizes,
      variation,
      thumbImage,
      images,
      description,
      action: "quick shop",
      slug,
      tag,
      sku: sku
    };
    try {
      const response = await axiosPublic.put(`/products/update/${upProductId}`, newProduct);
      console.log("🚀 ~ handleProductUpload ~ response:", response.status)
      if (response.status === 200) {
        reset()
        setPrGender("");
        setPrtype("");
        setPrcategory("");
        setSelectSizeGuide("");
        setSizeValues([]);
        Swal.fire({
          icon: "success",
          title: "Product Updated Successfully!",
        })
        router.push(`/manage-products`);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Something went wrong",
        });
      }
    } catch (err) { 
      console.error('Error updating product to database:', err);
    } finally {
      setLoading(false);
    }
  };

  const sizeArrays = [
    {key: "n/a", label: "N/A"},
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


  const handleGenderChange = (e) => {setPrGender(e.target.value);};
  const handlePrTypeChange = (e) => {setPrtype(e.target.value);};
  const handleSelectSizeGuide = (e) => {setSelectSizeGuide(e.target.value);};
  const handlePrCategoryChange = (e) => {setPrcategory(e.target.value);};

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
          <Input {...register("title")} 
          labelPlacement="outside" 
          variant="faded" radius="sm" 
          label="Product Name"
          defaultValue={productMain.name}  
          placeholder="Enter product name" fullWidth />
          {errors.title && <span className="text-tiny text-red-500">This field is required</span>}
          <div className="grid grid-cols-3 gap-4">
            <div>
            <Input {...register("brand")} 
            labelPlacement="outside" 
            variant="faded" radius="sm"
            defaultValue={productMain?.brand}  
            label="Product Brand (optional)" 
            placeholder="Type Brnad name" fullWidth />
            </div>
            <div>
            <Select {...register("category")} 
              label="Product Category" 
              labelPlacement="outside" 
              variant="faded" radius="sm"
              selectedKeys={[prCategory]}
              onChange={handlePrCategoryChange} 
              placeholder="Select a Category" fullWidth>
              {categoryInfo.map((category) => (
                <SelectItem className="text-medium" key={category.path} textValue={category.label}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
            {errors.category && <span className="text-tiny text-red-500">This field is required</span>}
            </div>
            <div>
            <Select {...register("productType")} 
              label="Product Type" 
              labelPlacement="outside" 
              variant="faded" radius="sm" 
              selectedKeys={[prType]}
              onChange={handlePrTypeChange}
              placeholder="Select a Product Type" fullWidth>
              {productTypesInfo.map((type) => (
                <SelectItem className="text-medium" key={type.path} textValue={type.label}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>
            {errors.productType && <span className="text-tiny text-red-500">This field is required</span>}
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
              {...register("productSize")}  
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
              label="Select Size Guide (optional)" 
              labelPlacement="outside" 
              variant="faded" radius="sm" 
              {...register("sizeGuide")} 
              selectedKeys={[selectSizeGuide]}
              onChange={handleSelectSizeGuide}
              placeholder="Select Size Guide" fullWidth>
              {sizeGuideInfo.map((item) => (
                <SelectItem key={item.imgUrl} textValue={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </Select>
            </div>
            <div>
            <Select {...register("gender")} 
              label="Select Gender (optional)" 
              labelPlacement="outside" 
              variant="faded" radius="sm"
              selectedKeys={[prGender]} 
              onChange={handleGenderChange}
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
              defaultValue={productMain?.originPrice} 
              labelPlacement="outside"
              {...register("originalPrice")}
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
                startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">৳</span>
                </div>
                } 
                {...register("sellingPrice")} 
                labelPlacement="outside" 
                defaultValue={productMain?.price} 
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
              label="Prodcut Code (optional)" 
              variant="faded" 
              placeholder="12345678"
              defaultValue={productMain?.sku} 
              labelPlacement="outside"
              {...register("sku")}
            />
            </div>
            <div>
            <Input
              type="number"
              label="Prodcut Stock Quantity"
              variant="faded" 
              min={1}
              defaultValue={productMain?.quantity} 
              placeholder="Type product quantity"
              labelPlacement="outside"
              {...register("quantity")}
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
                placeholder="Write about your product"
                labelPlacement="outside"
                defaultValue={productMain?.description} 
                {...register("description")}
              />
              {errors.description && <span className="text-tiny text-red-500">This field is required</span>}
            </div>
          </div>
        </div>

        <Button isLoading={loading} disabled={loading} type="submit" color="primary">Add Product</Button>
      </div>
      </form>
    </section>
  );
}


export default ManageUpdateProduct