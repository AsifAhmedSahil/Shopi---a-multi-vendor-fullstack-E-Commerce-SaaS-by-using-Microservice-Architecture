"use client";
import ImagePlaceholder from "apps/seller-ui/src/shared/components/image-placeholder/page";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BsChevronRight } from "react-icons/bs";
import Input from "../../../../../../../packages/components/input";
import ColorSelector from "packages/components/color-seletor";
import CustomSpecifications from "packages/components/custom-specification";
import CustomProperties from "packages/components/custom-properties";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "apps/seller-ui/src/utils/axiosInstance";
// import RichTextEditor from "packages/components/rich-text-editor";
import SizeSelector from "packages/components/size-selector";

import dynamic from "next/dynamic";
import axios from "axios";
import { Key, Wand, X } from "lucide-react";
import Image from "next/image";
import { enhancements } from "apps/seller-ui/src/utils/AI.enhancement";

const RichTextEditor = dynamic(
  () => import("packages/components/rich-text-editor"),
  { ssr: false }
);

interface UploadedImages {
  fileId: string;
  file_url: string;
}

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
  const [isChanged, setIsChanged] = useState(true);
  const [activeEffect,setActiveEffect] = useState<string | null>(null)
  const [images, setImages] = useState<(UploadedImages | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [pictureUploadingLoader, setPictureUploadingLoader] = useState(false);
  const [processing,setProcessing] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/product/api/get-categories");
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const { data: discountCodes = [], isLoading: discountLoading } = useQuery({
    queryKey: ["shop-discount"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-discount-codes");

      return res?.data?.discount_codes || [];
    },
  });

  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || {};

  const selectedCategory = watch("category");
  const regularPrice = watch("regular_price");

  const subCategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subCategoriesData]);

  console.log(categories, subCategoriesData);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const convertFileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (file: File | null, index: number) => {
    if (!file) return;

    setPictureUploadingLoader(true);

    try {
      const fileName = await convertFileToBase64(file);

      const response = await axiosInstance.post(
        "/product/api/upload-product-image",
        { file: fileName }
      );
      const uploadedImages: UploadedImages = {
        fileId: response.data.fileId,
        file_url: response.data.file_url,
      };

      const updatedImages = [...images];
      updatedImages[index] = uploadedImages;

      if (index === images.length - 1 && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      setImages(updatedImages);
      setValue("image", updatedImages);
    } catch (error) {
      console.log(error);
    } finally {
      setPictureUploadingLoader(false);
    }
  };

  useEffect(() => {
    console.log("State changed:", pictureUploadingLoader);
  }, [pictureUploadingLoader]);

  const handleRemoveChange = async (index: number) => {
    console.log(index);
    try {
      const updatedImages = [...images];
      const imageToDelete = updatedImages[index];

      if (imageToDelete && typeof imageToDelete === "object") {
        // delete picture
        await axiosInstance.delete("/product/api/delete-product-image", {
          data: {
            fileId: imageToDelete.fileId!,
          },
        });
      }

      updatedImages.splice(index, 1);

      // add null placeholder

      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      setImages(updatedImages);
      setValue("image", updatedImages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveDraft = () => {};

  const applyTransformation = async (transformation: string) => {
  if (!selectedImage || processing) return;

  setProcessing(true);
  setActiveEffect(transformation);

  try {
    // ✅ Remove existing transformations
    const [baseUrl] = selectedImage.split("?tr=");

    // ✅ Add new transformation
    const transformUrl = `${baseUrl}?tr=${transformation}`;

    console.log("Transformed URL:", transformUrl);

    setSelectedImage(transformUrl);
  } catch (error) {
    console.log(error);
  } finally {
    setProcessing(false);
  }
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
          {(images.length === 0 || images[0] === null || images[0]) && (
            <ImagePlaceholder
              setOpenImageModal={setOpenImageModal}
              size="765*850"
              small={false}
              index={0}
              images={images}
              pictureUploadingLoader={pictureUploadingLoader}
              onImageChange={handleImageChange}
              setSelectedImage={setSelectedImage}
              onRemove={handleRemoveChange}
              // defaultImage={images[0]?.file_url || null}
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
                        <CustomSpecifications
                          control={control}
                          errors={errors}
                        />
                      </div>
                      <div className="mt-2">
                        <CustomProperties control={control} errors={errors} />
                      </div>
                      <div className="mt-2">
                        <label className="block mb-1 font-semibold text-gray-300">
                          Cash On Delivery*
                        </label>
                        <select
                          {...register("cash_on_delivery", {
                            required: "Cash On Delivery is required",
                          })}
                          defaultValue="yes"
                          className="w-full border outline-none border-gray-700 bg-transparent"
                        >
                          <option value="yes" className="bg-black">
                            Yes
                          </option>
                          <option value="no" className="bg-black">
                            No
                          </option>
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

              {isLoading ? (
                <p>Loading Categories</p>
              ) : isError ? (
                <p>Failed to get categories</p>
              ) : (
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-transparent"
                    >
                      <option value="" className="bg-black">
                        select category
                      </option>
                      {categories.map((category: string) => (
                        <option
                          value={category}
                          key={category}
                          className="bg-black"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message as string}
                </p>
              )}

              <div className="mt-2">
                <label className="block font-semibold mt-1 text-gray-300">
                  Sub category*
                </label>

                {isLoading ? (
                  <p>Loading Subcategories</p>
                ) : isError ? (
                  <p>Failed to get Subcategories</p>
                ) : (
                  <Controller
                    name="subcategory"
                    control={control}
                    rules={{ required: "Subcategory is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full border outline-none border-gray-700 bg-transparent"
                      >
                        <option value="" className="bg-black">
                          select Subcategory
                        </option>
                        {subCategories.map((category: string) => (
                          <option
                            value={category}
                            key={category}
                            className="bg-black"
                          >
                            {category}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                )}
                {errors.subcategory && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subcategory.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <label className="block font-semibold mt-1 text-gray-300">
                  Detailed Description* (Min 100 words)
                </label>

                <Controller
                  name="detailed_description"
                  control={control}
                  rules={{
                    required: "Detailed description is required!",
                    validate: (value) => {
                      const wordCount = value
                        ?.split(/\s+/)
                        .filter((word: string) => word).lenght;
                      return (
                        wordCount >= 100 ||
                        "Description must be at least 100 words!"
                      );
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Describe your topic in detail..."
                    />
                  )}
                />

                {errors.detailed_description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.detailed_description.message as string}
                  </p>
                )}
              </div>

              <div className="mt-10">
                <Input
                  label="Video URL"
                  placeholder="https://youtube.com/xyz"
                  {...register("video_url", {
                    pattern: {
                      value:
                        /^http:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+$/,
                      message:
                        "Invalid Youtube embed URL! Use format: https://www.youtube.com",
                    },
                  })}
                />

                {errors.video_url && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.video_url.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Regular Price"
                  placeholder="$20"
                  {...register("regular_price", {
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be at least 1" },
                    validate: (value) =>
                      !isNaN(value) || "Only numbers are allowed",
                  })}
                />
                {errors.regular_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.regular_price.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Sell Price"
                  placeholder="$20"
                  {...register("sell_price", {
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be at least 1" },
                    validate: (value) => {
                      if (isNaN(value)) return "Only numbers are allowed";
                      if (regularPrice && value >= regularPrice) {
                        return "Sale Price must be less than regular price";
                      }
                      return true;
                    },
                  })}
                />
                {errors.sell_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sell_price.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Stock *"
                  placeholder="$20"
                  {...register("stock", {
                    required: "Stock is required!",
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be at least 1" },
                    max: {
                      value: 1000,
                      message: "Stock cannot exceed 1000",
                    },
                    validate: (value) => {
                      if (isNaN(value)) return "Only numbers are allowed";
                      if (!Number.isInteger(value))
                        return "Stock must be a whole number!";
                      return true;
                    },
                  })}
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stock.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <SizeSelector control={control} errors={errors} />
              </div>

              <div className="mt-3">
                <label className="block font-semibold mt-1 text-gray-300">
                  Select Discount Codes(optional)
                </label>

                {discountLoading ? (
                  <p className="text-gray-400">Loading discount codes...</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {discountCodes?.map((code: any) => (
                      <button
                        type="button"
                        key={code.id}
                        className={`px-3 py-1 rounded-md text-sm font-semibold border ${
                          watch("discountCodes")?.includes(code.id)
                            ? "bg-blue-600 text-white border-blue-600"
                            : " bg-gray-600 text-gray-300 border-gray-600 "
                        }  `}
                        onClick={() => {
                          const currentSelection = watch("discountCodes") || [];
                          const updatedSelection = currentSelection?.includes(
                            code.id
                          )
                            ? currentSelection.filter(
                                (id: string) => id !== code.id
                              )
                            : [...currentSelection, code.id];

                          setValue("discountCodes", updatedSelection);
                        }}
                      >
                        {code?.public_name} ({code.discountValue}{" "}
                        {code.discountType === "percentage" ? "%" : "$"})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {openImageMmodal && (
            <div className="fixed top-0 left-0 bg-black flex justify-center items-center w-full h-full bg-opacity-50 z-50">
              <div className="w-[450px] bg-gray-800 text-white p-6">
                <div className="flex justify-between items-center pb-3 mb-4">
                  <h2 className="text-lg font-semibold">
                    Enhance Product Image
                  </h2>

                  <X
                    size={22}
                    className="cursor-pointer"
                    onClick={() => setOpenImageModal(!openImageMmodal)}
                  />
                </div>

                <div className="relative w-full h-[250px] rounded-md overflow-hidden border border-gray-600">
                  <Image
                    src={selectedImage}
                    alt="product-image"
                    fill
                    unoptimized
                  />
                </div>

                {
                  selectedImage && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-white text-sm font-semibold">
                        AI Enhancements
                      </h3>

                      <div className="grid grid-cols-2 gap-3 mx-h-[250px] overflow-y-auto ">
                        {
                          enhancements.map(({label,effect})=>(
                            <button key={effect}
                            className={`p-2 rounded-md flex items-center gap-2 ${activeEffect === effect ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"} `}
                            onClick={()=> applyTransformation(effect)}
                            disabled={processing}
                            >
                              <Wand size={18}/>
                              {label}

                            </button>

                          ))
                        }

                      </div>

                    </div>
                  )
                }
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            {isChanged && (
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-gray-700 text-white rounded-md"
              >
                Save Draft
              </button>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
