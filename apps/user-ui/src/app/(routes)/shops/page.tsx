"use client";


import { categories } from "apps/user-ui/src/configs/categories";
import ShopCard from "apps/user-ui/src/shared/components/cards/shop.card";

import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import { countries } from "apps/user-ui/src/utils/countries";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";




const Page = () => {
  const router = useRouter();
 

  // States
  
  const [isShopLoading, setIsShopLoading] = useState(false);
 
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  
  const [page, setPage] = useState(1);

  const [shops, setShops] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1); 

  // console.log(products)



  // Update URL query params
  const updateURL = () => {
    const params = new URLSearchParams();
    params.set("page", page.toString());

    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));
    if (selectedCountries.length > 0)
      params.set("countries", selectedCountries.join(","));

    router.replace(`/shops?${params.toString()}`);
  };

  // Fetch API
  const fetchFilteredShops = async () => {
    setIsShopLoading(true);

    try {
      const params = new URLSearchParams();
      
      params.set("page", page.toString());
      params.set("limit", "12");

      if (selectedCategories.length > 0)
        params.set("categories", selectedCategories.join(","));

      if (selectedCountries.length > 0)
      params.set("countries", selectedCountries.join(","));

      

      const res = await axiosInstance.get(
        `/product/api/get-filtered-shops?${params.toString()}`
      );
      console.log(res);

      setShops(res.data.shops);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setIsShopLoading(false);
    }
  };

  // React to state change
  useEffect(() => {
    updateURL();
    fetchFilteredShops();
  }, [ selectedCategories, page]);

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label)
        ? prev.filter((cat) => cat !== label)
        : [...prev, label]
    );
  };
  const toggleCountry = (label: string) => {
    setSelectedCountries((prev) =>
      prev.includes(label)
        ? prev.filter((cat) => cat !== label)
        : [...prev, label]
    );
  };


  return (
    <div className="w-full bg-[#f5f5f5] pb-10">
      <div className="w-[90%] lg:w-[80%] m-auto">
        {/* Header */}
        <div className="pb-[50px]">
          <h1 className="md:pt-[40px] font-medium text-[44px] leading-1 mb-[14px] font-jost">
            All Shops
          </h1>

          <Link href="/" className="text-[#55585b] hover:underline">
            Home
          </Link>
          <span className="inline-block p-[1.5px] mx-1 bg-[#a8acb0] rounded-full">
            .
          </span>
          <span className="text-[#55585b]">All Shops</span>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-[270px] bg-white p-4 rounded shadow-md space-y-6">
           


            {/* categories */}
            <h3 className="text-xl font-Poppins font-medium border-b border-b-slate-200 pb-1">
              Categories
            </h3>
            <ul className="space-y-2 !mt-3">
              {categories?.map((category: any) => (
                  <li
                    key={category.label}
                    className="flex items-center justify-between"
                  >
                    <label className="flex items-center gap-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.value)}
                        onChange={() => toggleCategory(category.value)}
                        className="accent-blue-600"
                      />
                      {category.value}
                    </label>
                  </li>
                ))
              }
            </ul>
            {/* countries */}
            <h3 className="text-xl font-Poppins font-medium border-b border-b-slate-200 pb-1">
              Countries
            </h3>
            <ul className="space-y-2 !mt-3">
              {countries?.map((country: any) => (
                  <li
                    key={country}
                    className="flex items-center justify-between"
                  >
                    <label className="flex items-center gap-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country)}
                        onChange={() => toggleCountry(country)}
                        className="accent-blue-600"
                      />
                      {country}
                    </label>
                  </li>
                ))
              }
            </ul>

           
          </aside>

          {/* shop grid */}
          <div className="flex-1 px-2 lg:px-3">
            {isShopLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[250px] bg-gray-300 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : shops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {shops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            ) : (
              <p>No Shops Found!</p>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 !rounded border border-gray-200 text-sm ${
                      page === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
