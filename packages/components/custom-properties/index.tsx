import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Input from "../input"; // Ensure this is a valid input wrapper
import { Plus, X } from "lucide-react";

const CustomProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = useState<
    { label: string; values: string[] }[]
  >([]);
  const [newLabel, setNewLabel] = useState("");
  const [newValues, setNewValues] = useState<string[]>([]); // Array of values per property

  return (
    <div>
      <div className="flex flex-col gap-3">
        <Controller
          name={`custom_properties`}
          control={control}
          render={({ field }) => {
            useEffect(() => {
              field.onChange(properties);
            }, [properties]);

            const addProperty = () => {
              if (!newLabel.trim()) return;

              setProperties([...properties, { label: newLabel, values: [] }]);
              setNewValues([...newValues, ""]);
              setNewLabel("");
            };

            const addValue = (index: number) => {
              const valueToAdd = newValues[index];
              if (!valueToAdd.trim()) return;

              const updatedProperties = [...properties];
              updatedProperties[index].values.push(valueToAdd);
              setProperties(updatedProperties);

              const updatedNewValues = [...newValues];
              updatedNewValues[index] = "";
              setNewValues(updatedNewValues);
            };

            const removeProperty = (index: number) => {
              setProperties(properties.filter((_, i) => i !== index));
              setNewValues(newValues.filter((_, i) => i !== index));
            };

            const updateNewValue = (index: number, value: string) => {
              const updated = [...newValues];
              updated[index] = value;
              setNewValues(updated);
            };

            return (
              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Custom Properties
                </label>

                {/* Always visible input to add new property */}
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    placeholder="Enter property label (e.g., Material, Warranty)"
                    value={newLabel}
                    onChange={(e: any) => setNewLabel(e.target.value)}
                  />
                  <button
                    className="px-3 py-2 bg-blue-500 text-white rounded-md flex items-center gap-1"
                    type="button"
                    onClick={addProperty}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                {/* Property List */}
                <div className="flex flex-col gap-3">
                  {properties.map((property, index) => (
                    <div
                      key={index}
                      className="border border-gray-700 p-3 rounded-lg bg-gray-900"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          {property.label}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeProperty(index)}
                        >
                          <X className="text-red-500" size={18} />
                        </button>
                      </div>

                      {/* Input to add value */}
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Enter value..."
                          className="border outline-none border-gray-700 bg-gray-800 p-2 rounded-md text-white w-full"
                          value={newValues[index] || ""}
                          onChange={(e) =>
                            updateNewValue(index, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="px-3 py-1 bg-blue-500 text-white rounded-md"
                          onClick={() => addValue(index)}
                        >
                          Add
                        </button>
                      </div>

                      {/* Display values */}
                      <div className="flex flex-wrap gap-2">
                        {property.values.map((value, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded-md bg-gray-700 text-white"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show error */}
                {errors.custom_properties && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.custom_properties.message as string}
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CustomProperties;
