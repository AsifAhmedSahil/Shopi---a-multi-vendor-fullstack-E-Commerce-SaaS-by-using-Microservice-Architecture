"use client";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "apps/seller-ui/src/utils/axiosInstance";
import { Plus, Trash } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { BsChevronRight } from "react-icons/bs";

const DiscountCodes = () => {
  const [showModal, setShowModal] = useState(false);

  const { data: discountCodes = [], isLoading } = useQuery({
    queryKey: ["shop-discount"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-discount");

      return res?.data?.discount_codes || [];
    },
  });

  const handleDeleteClick = async (discount:any) => {};

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-3xl text-white font-semibold">Discount Codes</h2>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
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
         {
              !isLoading &&  discountCodes?.length === 0 && (
                  <p className="text-gray-500 w-full pt-4 text-center">
                    No Discount Code Available
                  </p>
                )
              }
      </div>

      {/* create discount modal */}
      {
        showModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            

          </div>
        )
      }
    </div>
  );
};

export default DiscountCodes;
