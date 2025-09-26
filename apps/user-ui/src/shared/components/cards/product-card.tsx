import Link from "next/link";
import React from "react";

const ProductCard = ({
  product,
  isEvent,
}: {
  product: any;
  isEvent?: boolean;
}) => {
  return (
    <div className="w-full min-h-[350px] h-max bg-white rounded-lg relative">
      {isEvent && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-1 rounded-sm shadow-md">
          OFFER
        </div>
      )}

      {product?.stock <= 5 && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-slate-800">
          Limited Stock
        </div>
      )}

      <Link href={`/product/${product?.slug}`}>
        <img
          src={
            product?.images[0]?.url 
            // ||
            // "https://ik.imagekit.io/t1bpsrjkn/products/product-1758435118595_0rsVygZic.jpg"
          }
          alt={product?.title}
          height={300}
          width={300}
          className="w-full h-[200px] object-cover mx-auto rounded-t-md "
        />
      </Link>

      <Link
        href={`/shop/${product?.Shop?.id}`}
        className="block text-blue-500 text-sm font-semibold my-2 px-2"
      >
        {product?.Shop?.name}
      </Link>
    </div>
  );
};

export default ProductCard;
