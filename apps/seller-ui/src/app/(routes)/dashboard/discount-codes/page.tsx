"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "apps/seller-ui/src/utils/axiosInstance";
import { Plus, Trash, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import Input from "packages/components/input";
import { AxiosError } from "axios";
import DeleteDiscountCodeModal from "apps/seller-ui/src/shared/modals/delete.discount-codes";

const DiscountCodes = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDiscountCodeModal, setShowDeleteDiscountCodeModal] = useState(false);
  const [deleteDiscountCode,setDeleteDiscountCode] = useState<any>();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      public_name: "",
      discountType: "percentage",
      discountValue: "",
      discountCode: "",
    },
  });

  const { data: discountCodes = [], isLoading } = useQuery({
    queryKey: ["shop-discount"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-discount-codes");

      return res?.data?.discount_codes || [];
    },
  });

  console.log(discountCodes)

  const createDiscountCodeMutation = useMutation({
    mutationFn: async (data) => {
      await axiosInstance.post("/product/api/create-discount-code", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["shop-discount"],
      });
      reset();
      setShowModal(false);
    },
  });

  const deleteDiscountCoddeMutation = useMutation({
    mutationFn:async(discountId) =>{
      await axiosInstance.delete(`/product/api/delete-discount-code/${discountId}`)

    },
    onSuccess:() =>{
      queryClient.invalidateQueries({queryKey:["shop-discount"]})
      setShowDeleteDiscountCodeModal(false)
    }
  })

  const handleDeleteClick = async (discount: any) => {
    setDeleteDiscountCode(discount)
    setShowDeleteDiscountCodeModal(true)
  };

  const onSubmit = (data: any) => {
    if (discountCodes.lenght >= 8) {
      toast.error("You can only create upto 8 discount code");
      return;
    }

    createDiscountCodeMutation.mutate(data)
  };

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-3xl text-white font-semibold">Discount Codes</h2>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Create Discount
        </button>
      </div>

      {/* breadcrumb */}
      <div className="flex items-center text-white">
        <Link href={"/"} className="text-[#80Deea] cursor-pointer">
          Dashboard
        </Link>
        <BsChevronRight size={15} className="opacity-[0.8]" />
        <span>Discount Codes</span>
      </div>
      <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          Your Discount Codes
        </h3>

        {isLoading ? (
          <p className="text-gray-400 text-center">Loading discounts...</p>
        ) : (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Value</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {discountCodes?.map((discount: any) => (
                <tr
                  className="border-b border-gray-800 hover:bg-gray-800 transition"
                  key={discount?.id}
                >
                  <td className="p-3">{discount?.public_name}</td>

                  <td className="p-3 capitalize">
                    {discount?.discountType === "percentage"
                      ? "Percentage (%)"
                      : "Flat ($)"}
                  </td>
                  <td className="p-3 capitalize">
                    {discount?.discountType === "percentage"
                      ? `${discount.discountValue} %`
                      : `${discount.discountValue}`}
                  </td>

                  <td className="p-3">{discount.discountCode}</td>

                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteClick(discount)}
                      className="text-red-500 hover:text-red-400 transition"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!isLoading && discountCodes?.length === 0 && (
          <p className="text-gray-500 w-full pt-4 text-center">
            No Discount Code Available
          </p>
        )}
      </div>

      {/* create discount modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-[450px] shadow-lg">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <h3 className="text-xl text-white">Create Discount Code </h3>

              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setShowModal(false)}
              >
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              {/* title */}

              <Input
                label="Title (Public Name)"
                {...register("public_name", { required: "Title is required" })}
              />
              {errors.public_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.public_name.message}
                </p>
              )}

              {/* discount type */}

              <div className="mt-2">
                <label className="block font-semibold text-gray-600 mb-1">
                  Discount Type
                </label>

                <Controller
                  control={control}
                  name="discountType"
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-transparent"
                    >
                      <option value="percentage">Percentage(%)</option>
                      <option value="flat">Flat Amount($)</option>
                    </select>
                  )}
                />
              </div>

              {/* discount value */}
              <div className="mt-2">
                <Input
                  label="Discount Value"
                  type="number"
                  min={1}
                  {...register("discountValue", {
                    required: "Value is required",
                  })}
                />
              </div>

              <div className="mt-2">
                <Input
                  label="Discount Code"
                  {...register("discountCode", {
                    required: "Discount Code is required",
                  })}
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold flex items-center justify-center gap-2"
                disabled={createDiscountCodeMutation?.isPending}
              >
                <Plus size={18} />
                {createDiscountCodeMutation?.isPending
                  ? "Creating..."
                  : "Create"}
              </button>

              {createDiscountCodeMutation.isError && (
                <p className="text-red-500 text-sm mt-2">
                  {(
                    createDiscountCodeMutation.error as AxiosError<{
                      message: string;
                    }>
                  )?.response?.data?.message || "Something went wrong"}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {
        showDeleteDiscountCodeModal && deleteDiscountCode &&(
          <DeleteDiscountCodeModal
          discount={deleteDiscountCode}
          onClose={()=> setShowDeleteDiscountCodeModal(false)}
          onConfirm={()=> deleteDiscountCoddeMutation.mutate(deleteDiscountCode?.id)}
          />
        )
      }
    </div>
  );
};

export default DiscountCodes;
