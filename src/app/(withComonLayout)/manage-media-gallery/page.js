'use client'
import { Button, Image } from '@nextui-org/react';
import { CloudArrowUp } from '@phosphor-icons/react';
import React, { useState } from 'react'

function ManageMediaGallery() {
  const [selectedImages, setSelectedImages] = useState([]);
  
  // Function to handle image selection
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files).filter(
      (file) => ["image/png", "image/jpg", "image/jpeg"].includes(file.type)
    );
    setSelectedImages([...selectedImages, ...files]);
  };

  
  // Function to handle image removal
  const handleRemoveImage = (index) => () => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <section>
      <form action="">
        <div>
          <div className="border-1 border-gray-200 rounded-md overflow-hidden">
            <div className="px-4 border-b-1 gap-2 bg-gray-700 py-2 flex flex-col md:flex-row items-center justify-between">
              <h1 className="text-white">Select Media You want to uploads</h1>
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
        </div>
      </form>
      <div className="border-1 mt-5 border-gray-200 rounded-md overflow-hidden">
              
      </div>
    </section>
  )
}

// Component for product image selection input
const ImageSelectInput = ({ handleImageSelect }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <CloudArrowUp size={32} color="#808080"/>
          <div className="my-2 text-tiny text-center text-gray-500">
            <p className="font-semibold">Select to upload</p>
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


export default ManageMediaGallery