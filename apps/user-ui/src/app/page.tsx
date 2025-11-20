"use client";
import React from "react";
import Hero from "../shared/modules/hero";
import SectionTitle from "../shared/components/section/section-title";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import ProductCard from "../shared/components/cards/product-card";
import ShopCard from "../shared/components/cards/shop.card";

const page = () => {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/product/api/get-all-products?page-1&limit=10"
      );
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });
  const { data: latestProducts ,isLoading:latestProductLoading} = useQuery({
    queryKey: ["latest-products"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/product/api/get-all-products?page-1&limit=10&type=latest"
      );
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });
  const { data: shops, isLoading: shopLoading } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/top-shops");
      return res.data.shops;
    },
    staleTime: 1000 * 60 * 2,
  });
  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-all-events?page=1&limit=10");
      return res.data.events;
    },
    staleTime: 1000 * 60 * 2,
  });

  console.log(offers);
  return (
    <div className="bg-[#f5f5f5]">
      <Hero />

      <div className="md:w-[80%] w-[90%] m-auto my-10">
        <div className="mb-8">
          <SectionTitle title="Suggested Products" />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-[250px] bg-gray-300 animate-pulse rounded-xl"
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="m-auto gap-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 pb-10">
            {products?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {products?.length === 0 && (
          <p className="text-center">No Product available</p>
        )}

        {isLoading && (
          <div className=" grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 ">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                className="h-[250px] bg-gray-300 animate-pulse rounded-xl"
                key={index}
              ></div>
            ))}
          </div>
        )}

        <div className="my-8 block">
          <SectionTitle title="Latest Products" />
        </div>

        {!latestProductLoading && (
          <div className="m-auto gap-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 pb-10">
            {latestProducts?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {latestProducts?.length === 0 && (
          <p className="text-center">No Product available</p>
        )}
        {/* top shops */}

        <div className="my-8 block">
          <SectionTitle title="Top Shops" />
        </div>

        {!shopLoading && (
          <div className="m-auto gap-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 pb-10">
            {shops?.map((shop: any) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}

        {
          shops?.length === 0 && (
            <p className="text-center">No Shops Avaiable yet</p>
          )
        }
        {/* top offers */}

        <div className="my-8 block">
          <SectionTitle title="Top Offers" />
        </div>

        {!offersLoading && (
          <div className="m-auto gap-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 pb-10">
            {offers?.map((product: any) => (
              <ProductCard product={product} key={product.id} isEvent={true}/>
             
            ))}
          </div>
        )}

        {
          offers?.length === 0 && (
            <p className="text-center">No offers Avaiable yet</p>
          )
        }
      </div>
    </div>
  );
};

export default page;
