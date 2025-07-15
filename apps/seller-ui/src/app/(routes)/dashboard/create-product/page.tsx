"use client";
import ImagePlaceholder from "apps/seller-ui/src/shared/components/image-placeholder/page";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BsChevronRight } from "react-icons/bs";

const Page = () => {
  const {
    register,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openImageMmodal, setOpenImageModal] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleImageChange = (file: File | null, index: number) => {
    const updatedImages = [...images];
    updatedImages[index] = file;

    if (index === images.length - 1 && images.length < 8) {
      updatedImages.push(null);
    }

    setImages(updatedImages);
    setValue("images", updatedImages);
  };

  const handleRemoveChange = () =>{
    
  }

  return (
    <form
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* heading and breadcrumbs */}
      <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
        Create Products
      </h2>

      <div className="flex items-center">
        <span className="text-[#80Deea] cursor-pointer">Dashboard</span>
        <BsChevronRight size={15} className="opacity-[0.8]" />
        <span>Create Product</span>
      </div>
      {/* Content Layout */}
      <div className="py-4 w-full flex gap-6">
        {/* left side - image upload section */}
        <div className="w-[35%] ">
          <ImagePlaceholder
            setOpenImageModal={setOpenImageModal}
            size="765*850"
            small={false}
            index={0}
            onImageChange={handleImageChange}
            onRemove={handleRemoveChange}
          />
        </div>
      </div>
    </form>
  );
};

export default Page;
