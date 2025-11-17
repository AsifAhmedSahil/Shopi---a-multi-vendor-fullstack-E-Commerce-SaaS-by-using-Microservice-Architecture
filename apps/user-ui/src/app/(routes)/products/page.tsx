"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Range } from "react-range";

const MAX = 1199;
const MIN = 0;

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States
  const [priceRange, setPriceRange] = useState([0, 1199]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 1199]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isProductLoading, setIsProductLoading] = useState(false);

  const colors = [
    { name: "Red", code: "#FF0000" },
    { name: "Blue", code: "#007BFF" },
    { name: "Green", code: "#28A745" },
    { name: "Yellow", code: "#FFC107" },
    { name: "Orange", code: "#FD7E14" },
    { name: "Purple", code: "#6F42C1" },
    { name: "Pink", code: "#E83E8C" },
    { name: "Teal", code: "#20C997" },
    { name: "Brown", code: "#795548" },
    { name: "Black", code: "#000000" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "28", "30"];

  // Update URL query params
  const updateURL = () => {
    const params = new URLSearchParams();

    params.set("priceRange", priceRange.join(","));
    params.set("page", page.toString());

    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));

    if (selectedColors.length > 0)
      params.set("colors", selectedColors.join(","));

    if (selectedSizes.length > 0) params.set("sizes", selectedSizes.join(","));

    router.replace(`/products?${params.toString()}`);
  };

  // Fetch API
  const fetchFilteredProducts = async () => {
    setIsProductLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("priceRange", priceRange.join(","));
      params.set("page", page.toString());
      params.set("limit", "12");

      if (selectedCategories.length > 0)
        params.set("categories", selectedCategories.join(","));

      if (selectedColors.length > 0)
        params.set("colors", selectedColors.join(","));

      if (selectedSizes.length > 0)
        params.set("sizes", selectedSizes.join(","));

      const res = await axiosInstance.get(
        `/product/api/get-filtered-products?${params.toString()}`
      );

      setProducts(res.data.product);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setIsProductLoading(false);
    }
  };

  // React to state change
  useEffect(() => {
    updateURL();
    fetchFilteredProducts();
  }, [priceRange, selectedCategories, selectedColors, selectedSizes, page]);

  // Load categories via react-query
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-categories");
      return res.data;
    },
    staleTime: 1000 * 60 * 30,
  });

  console.log(categoriesData);

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label)
        ? prev.filter((cat) => cat !== label)
        : [...prev, label]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  return (
    <div className="w-full bg-[#f5f5f5] pb-10">
      <div className="w-[90%] lg:w-[80%] m-auto">
        {/* Header */}
        <div className="pb-[50px]">
          <h1 className="md:pt-[40px] font-medium text-[44px] leading-1 mb-[14px] font-jost">
            All Products
          </h1>

          <Link href="/" className="text-[#55585b] hover:underline">
            Home
          </Link>
          <span className="inline-block p-[1.5px] mx-1 bg-[#a8acb0] rounded-full">
            .
          </span>
          <span className="text-[#55585b]">All Products</span>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-[270px] bg-white p-4 rounded shadow-md space-y-6">
            <h3 className="text-xl font-Poppins font-medium">Price Filter</h3>

            <div className="ml-2">
              <Range
                step={1}
                min={MIN}
                max={MAX}
                values={tempPriceRange}
                onChange={(values) => setTempPriceRange(values)}
                onFinalChange={(values) => setPriceRange(values)}
                renderTrack={({ props, children }) => {
                  const [min, max] = tempPriceRange;
                  const left = ((min - MIN) / (MAX - MIN)) * 100;
                  const right = ((max - MIN) / (MAX - MIN)) * 100;

                  return (
                    <div
                      {...props}
                      className="h-[6px] bg-gray-300 rounded relative"
                    >
                      <div
                        className="absolute h-full bg-blue-500 rounded"
                        style={{
                          left: `${left}%`,
                          width: `${right - left}%`,
                        }}
                      />
                      {children}
                    </div>
                  );
                }}
                renderThumb={({ props }) => {
                  const { key, ...rest } = props;

                  return (
                    <div
                      key={key}
                      {...rest}
                      className="w-[16px] h-[16px] bg-blue-600 rounded-full shadow"
                    />
                  );
                }}
              />
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-700">
                Price: ${tempPriceRange[0]} - ${tempPriceRange[1]}
              </div>

              <button
                onClick={() => {
                  setPriceRange(tempPriceRange);
                  setPage(1);
                }}
                className="text-sm px-4 py-1 bg-gray-200 hover:bg-blue-600 hover:text-white transition !rounded font-semibold"
              >
                Apply
              </button>
            </div>

            {/* categories */}
            <h3 className="text-xl font-Poppins font-medium border-b border-b-slate-200 pb-1">
              Categories
            </h3>
            <ul className="space-y-2 !mt-3">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                categoriesData?.categories?.map((category: any) => (
                  <li
                    key={category}
                    className="flex items-center justify-between"
                  >
                    <label className="flex items-center gap-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="accent-blue-600"
                      />
                      {category}
                    </label>
                  </li>
                ))
              )}
            </ul>

            {/* color */}
            <h3 className="text-xl font-Poppins font-medium border-b border-b-slate-200 pb-1 mt-6">
              Filter by Color
            </h3>

            <ul className="space-y-2 !mt-3">
              {colors.map((color) => (
                <li
                  key={color.name}
                  className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color.name)}
                    onChange={() => toggleColor(color.name)}
                    className="accent-blue-600"
                  />
                  <div className="flex items-center gap-2">
                    {/* Color Circle */}
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300 inline-block"
                      style={{ backgroundColor: color.code }}
                    ></span>

                    {/* Color Name */}
                    <span className="text-sm text-gray-700">{color.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* Product Section */}
          <main className="flex-1">
            {isProductLoading ? (
              <p>Loading products...</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((item: any) => (
                  <div key={item.id} className="bg-white p-4 rounded shadow">
                    <p className="font-medium">{item.name}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Page;
