"use client";
import { countries } from "apps/user-ui/src/utils/countries";
import { Plus, X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const ShippingAddressSection = () => {
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      label: "Home",
      name: "",
      street: "",
      city: "",
      zip: "",
      country: "Bangladesh",
      isDefault: "false",
    },
  });

  const onSubmit = () => {
    
  };
  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Saved Address</h2>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      </div>

      {/* address list */}
      <div></div>

      {/* modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-md shadow-md relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-600">
              <X className="w-5 h-5" onClick={() => setShowModal(false)} />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Add New Address
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <select {...register("label")} className="form-input">
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>

              <input
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
                className="form-input"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}

              <input
                placeholder="Street"
                {...register("street", { required: "Street is required" })}
                className="form-input"
              />
              {errors.street && (
                <p className="text-red-500 text-xs">{errors.street.message}</p>
              )}
              <input
                placeholder="City"
                {...register("city", { required: "City is required" })}
                className="form-input"
              />
              {errors.city && (
                <p className="text-red-500 text-xs">{errors.city.message}</p>
              )}
              <input
                placeholder="Zip Code"
                {...register("zip", { required: "zip code is required" })}
                className="form-input"
              />
              {errors.zip && (
                <p className="text-red-500 text-xs">{errors.zip.message}</p>
              )}

              <select {...register("country")} className="form-input">
                {countries.map((country) => (
                  <option value={country} key={country}>
                    {country}
                  </option>
                ))}
              </select>

              <select {...register("isDefault")} className="form-input">
                <option value="true">Set as Default</option>
                <option value="false">Not Default</option>
              </select>

              <button type="submit" className="w-full bg-blue-600 text-white text-sm py-2 rounded-md hover:text-blue-700 transition">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddressSection;
