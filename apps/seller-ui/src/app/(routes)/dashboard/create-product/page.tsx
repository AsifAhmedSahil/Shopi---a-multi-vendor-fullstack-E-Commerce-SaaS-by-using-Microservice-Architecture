"use client";
import ImagePlaceholder from "apps/seller-ui/src/shared/components/image-placeholder/page";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BsChevronRight } from "react-icons/bs";
import Input from "../../../../../../../packages/components/input";
import ColorSelector from "packages/components/color-seletor";
import CustomSpecifications from "packages/components/custom-specification";
import CustomProperties from "packages/components/custom-properties";

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

  const handleRemoveChange = (index: number) => {
    setImages((prevImages) => {
      let updatedImages = [...prevImages];
      if (index === -1) {
        updatedImages[0] = null;
      } else {
        updatedImages.splice(index, 1);
      }

      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      return updatedImages;
    });

    setValue("image", images);
  };

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
        <div className="w-[35%] ">
          {images.length > 0 && (
            <ImagePlaceholder
              setOpenImageModal={setOpenImageModal}
              size="765*850"
              small={false}
              index={0}
              onImageChange={handleImageChange}
              onRemove={handleRemoveChange}
            />
          )}
        </div>
        {/* right side - form inputs */}

        <div className="md:w-[65%]">
          <div className="w-full flex gap-6">
            <div className="w-2/4 ">
              <Input
                label="Product Title"
                placeholder="Enter Product Title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message as string}
                </p>
              )}

              <div className="mt-2">
                <Input
                  type="textarea"
                  rows={7}
                  cols={10}
                  label="Short Description about Product (Max 150 words)"
                  placeholder="Enter Product Description "
                  {...register("description", {
                    required: "Description is requiered",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        `Description cannot exceed 150 words (Current:${wordCount})`
                      );
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message as string}
                  </p>
                )}

                <div className="mt-2">
                  <Input
                    label="Tags *"
                    placeholder="apple,flagship"
                    {...register("tags", {
                      required: "Separate related products tags with a comma",
                    })}
                  />
                  {errors.tags && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.tags.message as string}
                    </p>
                  )}

                  <div className="mt-2">
                    <Input
                      label="Warranty *"
                      placeholder="1 year / No Warranty"
                      {...register("warranty", {
                        required: "Warranty is required!",
                      })}
                    />
                    {errors.warranty && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.warranty.message as string}
                      </p>
                    )}

                    <div className="mt-2">
                      <Input
                        label="Slug *"
                        placeholder="Product_slug"
                        {...register("slug", {
                          required: "slug is required!",
                          pattern: {
                            value: /^[a-z 0-9]+(?:-[a-z0-9]+)*$/,
                            message:
                              "Invalid slug format! use only lowercase letters, numbers , and special character ",
                          },
                          minLength: {
                            value: 3,
                            message: "Slug must be at least 3 characters long",
                          },
                          maxLength: {
                            value: 50,
                            message:
                              "slug can not be longer than 50 characters.",
                          },
                        })}
                      />
                      {errors.slug && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.slug.message as string}
                        </p>
                      )}

                      <div className="mt-2">
                        <Input
                          label="Brand"
                          placeholder="Apple"
                          {...register("brand")}
                        />
                        {errors.brand && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.brand.message as string}
                          </p>
                        )}
                      </div>
                      <div className="mt-2">
                        <ColorSelector control={control} errors={errors} />
                      </div>

                      {/* custom specification */}
                      <div className="mt-2">
                        <CustomSpecifications control={control} errors={errors}/>

                      </div>
                      <div className="mt-2">
                        <CustomProperties control={control} errors={errors}/>

                      </div>
                      <div className="mt-2">
                        <label className="block mb-1 font-semibold text-gray-300">
                          Cash On Delivery*
                        </label>
                        <select 
                        {
                          ...register("cash_on_delivery",{
                            required: "Cash On Delivery is required"

                          })

                        }
                        defaultValue="yes"
                        className="w-full border outline-none border-gray-700 bg-transparent"

                        >
                          <option value="yes" className="bg-black">Yes</option>
                          <option value="no" className="bg-black">No</option>

                        </select>

                        {errors.cash_on_delivery && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.cash_on_delivery.message as string}
                          </p>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/4">
            <label className="block font-semibold mt-1 text-gray-300">
              Category*
            </label>

            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
