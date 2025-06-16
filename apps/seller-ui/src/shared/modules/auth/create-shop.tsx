import { useMutation } from "@tanstack/react-query";
import { shopCategories } from "apps/seller-ui/src/utils/shopCategories";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";

const CreateShop = ({
  sellerId,
  setActiveStep,
}: {
  sellerId: string;
  setActiveStep: (step: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const shopCreateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-shop`,
        data
      );

      return response.data;
    },
    onSuccess: () => {
      setActiveStep(3);
    },
  });

  const onSubmit = async (data: any) => {
    const shopData = { ...data, sellerId };

    shopCreateMutation.mutate(shopData);
  };

  const countwords = (text: string) => text.trim().split(/\s+/).length;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-3xl font-semibold text-center mb-2">
          Setup new shop
        </h3>

        <label className="block text-gray-700 mb-1">Name*</label>
        <input
          type="text"
          placeholder="Enter Your Shop Name"
          className="w-full p-2 border border-gray-400 !rounded mb-1 outline-0"
          {...register("name", {
            required: "Name is required!",
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}
        <label className="block text-gray-700 mb-1">Bio(max 100 words)*</label>
        <input
          type="text"
          placeholder="Enter Your Shop Bio"
          className="w-full p-2 border border-gray-400 !rounded mb-1 outline-0"
          {...register("bio", {
            required: "Bio is required!",
            validate: (value) =>
              countwords(value) <= 100 || "Bio Can not be more than 100 words",
          })}
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{String(errors.bio.message)}</p>
        )}
        <label className="block text-gray-700 mb-1">Address*</label>
        <input
          type="text"
          placeholder="Enter Your Shop Address"
          className="w-full p-2 border border-gray-400 !rounded mb-1 outline-0"
          {...register("address", {
            required: "Address is required!",
          })}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">
            {String(errors.address.message)}
          </p>
        )}
        <label className="block text-gray-700 mb-1">Opening Hours*</label>
        <input
          type="text"
          placeholder="e.g Mon-Fri 10AM-6PM"
          className="w-full p-2 border border-gray-400 !rounded mb-1 outline-0"
          {...register("opening_hours", {
            required: "Opening hours is required!",
          })}
        />
        {errors.opening_hours && (
          <p className="text-red-500 text-sm">
            {String(errors.opening_hours.message)}
          </p>
        )}
        <label className="block text-gray-700 mb-1">Website*</label>
        <input
          type="url"
          placeholder="https://shopi.com"
          className="w-full p-2 border border-gray-400 !rounded mb-1 outline-0"
          {...register("website", {
            pattern: {
              value: /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/.*)?$/,
              message: "Enter a Valid URL",
            },
          })}
        />
        {errors.website && (
          <p className="text-red-500 text-sm">
            {String(errors.website.message)}
          </p>
        )}
        <label className="block text-gray-700 mb-1">Category*</label>
        <select
          
          className="w-full p-2 border border-gray-400 !rounded mb-1 outline-0"
          {...register("category", {
           required:"Category is required"
          })}
        >

          <option>Select a category</option>
          {
            shopCategories.map((category)=>(
              <option value={category.value} key={category.value}>{category.label}</option>
            ))
          }

        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">
            {String(errors.category.message)}
          </p>
        )}

        <button type="submit" className="w-full text-lg text-white bg-blue-600 py-2 rounded-lg mt-4">
            create
        </button>



      </form>
    </div>
  );
};

export default CreateShop;
