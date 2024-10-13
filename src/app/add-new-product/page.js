"use client"
import { Input, Button, Select, SelectItem, Image, Textarea, ModalContent, Modal, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, CardBody, Chip } from "@nextui-org/react";
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

function AddProductPage() {
  useEffect(() => {
    document.title = 'Add New Product | Admin Dashboard | Smart Original Brand Online Shop';
  }, []);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [sizeValues, setSizeValues] = useState([]);
  const [colorTyped, setColorTyped] = useState("");
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectSizeGuide, setSelectSizeGuide] = useState('');
  const [productColorCode, setProductColorCode] = useState("");
  const [selectedVariation, setSelectedVariation] = useState([]);
  const [productTag, setProductTag] = useState("");
  const [newProductTag, setNewProductTag] = useState([]);
  const [selectedColorImages, setSelectedColorImages] = useState(null);
  const [loadingUplaodVariation, setLoadingUplaodVariation] = useState(false);
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
        const newFirebaseImages = [];
        for (const file of selectedImages) {
            const uploadedImage = await uploadImageAsync(file);
            newFirebaseImages.push(uploadedImage);
        }
        await handleProductUpload(data, newFirebaseImages);
    } catch (error) {
        console.error('Error during product add:', error);
    } finally {
        setLoading(false);
    }
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

  // Function to handle image selection
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files).filter(
      (file) => ["image/png", "image/jpg", "image/jpeg"].includes(file.type)
    );
    setSelectedImages([...selectedImages, ...files]);
  };

  // Function to handle image selection
  const handleColorImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      setSelectedColorImages(file);
    }
  };

  // Function to handle image removal
  const handleRemoveImage = (index) => () => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
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

  const genderArray = [
    {key: "male", label: "Male"},
    {key: "female", label: "Female"}
  ];

  const addNewColorVariation = async (onClose) => {
    setLoadingUplaodVariation(true)
    if(selectedColorImages === null || colorTyped === '' || productColorCode === ''){
      Swal.fire({
        icon: "error",
        title: "Please Add Color image and Type Color name",
      });
      setLoadingUplaodVariation(false)
      return;
    }else {
      const uploadedImage = await uploadImageAsync(selectedColorImages);
      if(uploadedImage){
      // Generate a 6-digit key
      const key = Math.floor(100000 + Math.random() * 900000).toString();

      // Create the new variation object
      const newVariation = {
        key: key, // Add the generated key here
        color: colorTyped,
        colorCode: productColorCode,
        colorImage: uploadedImage,
        image: uploadedImage,
      };
      // Update the state with the new variation
      setSelectedVariation([...selectedVariation, newVariation]);
      setLoadingUplaodVariation(false)
      setSelectedColorImages(null)
      setColorTyped("")
      setProductColorCode("")
      onClose()
      }
    }
  }

  const handleDeleteVariation = async (key) => {
    // Find the variation to delete
    const variationToDelete = selectedVariation.find(v => v.key === key);
    if (!variationToDelete) {
      Swal.fire({
        icon: "error",
        title: "Variation not found.",
        text: "The selected variation does not exist.",
      });
      return;
    }
  
    const imageUrl = variationToDelete.colorImage;
  
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
  
      // Remove the variation from the state
      setSelectedVariation(prevVariations =>
        prevVariations.filter(v => v.key !== key)
      );
  
      // Notify the user of successful deletion
      Swal.fire({
        icon: "success",
        title: "Variation Deleted",
        text: "The color variation has been successfully deleted.",
      });
    } catch (error) {
      console.error('Error deleting variation:', error);
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "There was an error deleting the variation. Please try again.",
      });
    }
  };

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

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Product Image Upload Section */}
        <div className="border-1 border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 border-b-1 gap-2 bg-gray-700 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-white">Select Product Image</h1>
            <p className="text-xs text-white">SVG, PNG, JPG or GIF (MAX. 1000x1000px)</p>
          </div>
          <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 p-4 gap-4">
            <ImageSelectInput handleImageSelect={handleImageSelect} />
            {selectedImages.map((image, index) => (
              <SelectedImagePreview 
                key={index}
                image={image}
                onRemove={handleRemoveImage(index)}
              />
            ))}
          </div>
        </div>

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
          placeholder="Enter product name" fullWidth />
          {errors.title && <span className="text-tiny text-red-500">This field is required</span>}
          <div className="grid grid-cols-2 gap-4">
            <div>
            <Input {...register("brand", { required: true })} 
            labelPlacement="outside" 
            variant="faded" radius="sm" 
            label="Product Brand" 
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
        
        {/* Color Section */}
        <div className="border-1 border-gray-200 rounded-md overflow-hidden ">
          <div className="px-4 border-b-1 bg-gray-700 gap-2 py-2 flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-white">Color Variation</h1>
            <Button onPress={onOpen} color="primary">Add Color Varient</Button>
          </div>
          <div className="p-4 space-y-4">
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">Create A Color Variantion</ModalHeader>
                    <ModalBody>
                    {
                    selectedColorImages ? 
                    <div className="relative overflow-hidden rounded-md flex items-center justify-center w-full group">
                      <Image src={URL.createObjectURL(selectedColorImages)} alt={selectedColorImages.name} className="w-full border h-44 object-contain" />
                    </div> :
                    <div className="flex items-center justify-center w-full">
                      <Input color="secondary" size="lg" type="file" label="Select Photo" onChange={handleColorImageSelect}/>
                    </div>
                  }
                    <Input
                      autoFocus
                      label="Type Color Name"
                      placeholder="Type Color name"
                      labelPlacement="outside"
                      variant="bordered"
                      value={colorTyped}
                      onValueChange={setColorTyped}
                    />
                    <Input
                      autoFocus
                      label="Type Color Code"
                      placeholder="Example #ECB018"
                      labelPlacement="outside"
                      variant="bordered"
                      value={productColorCode}
                      onValueChange={setProductColorCode}
                    />
                    </ModalBody>
                    <ModalFooter>
                      <Button 
                      isLoading={loadingUplaodVariation} 
                      isDisabled={loadingUplaodVariation} 
                      onClick={() => addNewColorVariation(onClose)} 
                      className="w-full" color="primary">
                        Add
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
            <div className="gap-4 flex items-center justify-start">
            { selectedVariation ?
            selectedVariation.map((item, index) => (
              <div key={index} className="p-2 border-1 rounded-md">
                <Image src={item.colorImage} alt={item.color} width={100} className=" object-cover" height={100}/>
                <div className="rounded-md w-full p-2 text-center">
                <p className="text-base font-medium capitalize">{item.color}</p>
                </div>
                <Button size="sm" radius="sm" onClick={() => handleDeleteVariation(item.key)} className="w-full" color="danger">Delete</Button>
              </div>
            )) :
            <div className="rounded-md w-72 text-gray-900 bg-gray-300 p-4"><h1>You dont have any color variation</h1></div>
            }
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

// Component for product image selection input
const ImageSelectInput = ({ handleImageSelect }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <CloudArrowUp size={32} color="#808080"/>
          <div className="my-2 text-tiny text-center text-gray-500">
            <p className="font-semibold">Click to upload</p>
            <p>Images</p>
          </div>
        </div>
        <input 
        id="dropzone-file" 
        accept="image/png, image/jpg, image/jpeg"
        onChange={handleImageSelect} multiple  
        type="file" className="hidden" />
      </label>
    </div>
  );
}


// Component for displaying selected image previews with replace and remove buttons
const SelectedImagePreview = ({ image, onRemove }) => {
  const imageUrl = URL.createObjectURL(image);
  return (
    <div className="relative overflow-hidden rounded-md flex items-center justify-center w-full group">
       <Image radius="md" src={imageUrl} alt={image.name} className="w-full border-1 h-44 object-contain" />
      <div className="absolute rounded-md top-0 right-0 z-10 backdrop-grayscale-0 bg-gray-900/70 border-1 w-full h-full flex flex-col items-center justify-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" color="danger" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default AddProductPage;