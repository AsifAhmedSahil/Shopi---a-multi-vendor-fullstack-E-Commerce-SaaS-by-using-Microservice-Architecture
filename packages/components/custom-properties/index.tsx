import React, { useEffect, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import Input from "../input";
import { BsPlusCircle, BsTrash } from "react-icons/bs";

const CustomProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = useState<
    { label: string; values: string[] }[]
  >([]);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  return (
    <div>
      <div className="flex flex-col gap-3">
        <Controller
          name={`custom_properties`}
          control={control}
          render={({ field }) => {

            useEffect(()=> {
                field.onChange(properties);
            },[properties]);

            return (
              <Input
                label="Specification Name"
                placeholder="e.g., Battery Life, Weight, Material"
                {...field}
              />
            );
          }}
        />
        <Controller
          name={`custom_specifications.${index}.name`}
          control={control}
          rules={{ required: "Value is required" }}
          render={({ field }) => (
            <Input
              label="Value"
              placeholder="e.g., 4000mah, 1.5kg, Plastic"
              {...field}
            />
          )}
        />

        <button
          className="text-red-500 hover:text-red-700 "
          type="button"
          onClick={() => remove(index)}
        >
          <BsTrash size={20} />
        </button>
        <button
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          onClick={() => append({ name: "", value: "" })}
        >
          <BsPlusCircle size={20} /> Add Specification
        </button>
      </div>
      {errors.custom_specifications && (
        <p className="text-red-500 text-xs mt-1">
          {errors.custom_specifications.message as string}
        </p>
      )}
    </div>
  );
};

export default CustomProperties;
