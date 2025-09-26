import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ProductRating from "../ratings";
import { MapPin, MessageCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductDetailsCard = ({
  data,
  setOpen,
}: {
  data: any;
  setOpen: (open: boolean) => void;
}) => {
  const [activeImage, setActiveImage] = useState(0);

  const router = useRouter()

  return (
    <div
      className="fixed flex items-center justify-center top-0 left-0 h-screen w-full bg-[#0000001d] z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[90%] md:w-[70%] md:mt-24 2xl:mt-0 h-max overflow-scroll min-h-[70vh] p-4 md:p-6 bg-white shadow-md rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-full">
            <Image
              src={data?.images?.[activeImage]?.url}
              alt={data?.images?.[activeImage].url}
              width={400}
              height={400}
              className="w-full rounded-lg object-contain"
            />
            {/* thumbnail */}
            <div className="flex gap-2 mt-4">
              {data?.images?.map((img: any, index: number) => (
                <div
                  key={index}
                  className={`cursor-pointer border rounded-md ${
                    activeImage === index
                      ? "border-gray-500 pt-1"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={img?.url}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
            {/* Seller Info */}

            <div className="border-b relative pb-3 border-gray-200 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Image
                  src={
                    data?.Shop?.avatar ||
                    "https://ik.imagekit.io/t1bpsrjkn/products/product-1758435118595_0rsVygZic.jpg"
                  }
                  alt={data?.Shop?.category}
                  width={60}
                  height={60}
                  className="rounded-full w-[60px] h-[60px] object-cover"
                />

                <div>
                  <Link
                    href={`/shop/${data?.Shop?.id}`}
                    className="text-lg font-medium"
                  >
                    {data?.Shop?.name}
                  </Link>

                  {/* shop ratings */}
                  <span className="block mt-1">
                    <ProductRating rating={data?.Shop?.ratings}/>
                  </span>

                  {/* shop locations */}
                  <p className="text-gray-600 mt-1 flex items-center gap-3">
                    <MapPin size={20}/> {" "}
                    {data?.Shop?.address || "Location Not Available"}
                  </p>
                </div>

                
              </div>
              {/* chat with seller */}
                <button className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg" 
                onClick={() => router.push(`/inbox?shopId=${data?.Shop?.shopId}`)}
                >
                    <MessageCircle size={20} fill="white" stroke="white"/><span className="text-white"> Chat With Seller</span>
                </button>

                <button className="absolute flex justify-end w-full  right-[-5px] top-[-5px] mt-[-10px] cursor-pointer " onClick={()=> setOpen(false)}>
                    <X size={20} />
                </button>
            </div>

            <h3 className="text-xl font-semibold mt-3">
                  {data?.title}
            </h3>

            <p className="mt-2 text-gray-700 w-full whitespace-pre-wrap ">
                {data?.short_description} {" "}
            </p>

            {/* brand */}
            {
                data?.brand && (
                    <p className="mt-2">
                        <strong>Brand: </strong> {data.brand}
                    </p>
                )
            }

            {/* size options */}
            {
                data?.sizes?.length > 0 && (
                    <div>
                        <strong>Size: </strong>
                        <div className="flex gap-2 mt-1">
                            {
                                data.sizes.map((size: string, index:number)=>(
                                    <button key={index}>

                                    </button>
                                ))
                            }

                        </div>
                    </div>
                )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
