"use client";

import useDeviceTracking from "apps/user-ui/src/hooks/useDeviceTracking";
import useUSer from "apps/user-ui/src/hooks/useHook";
import useLocationTracking from "apps/user-ui/src/hooks/useLocation";
import { useStore } from "apps/user-ui/src/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CartPage = () => {
  const { user } = useUSer();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  const router = useRouter();

  const cart = useStore((state: any) => state.cart);
  const removeFromCart = useStore((state: any) => state.removeFromCart);

  const [loading, setLoading] = useState(false);
  const [discountedProductId, setDiscountedProductId] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  console.log(cart);

    const decreaseQuantity = (id: string) => {
      useStore.setState((state: any) => ({
        wishlist: state.cart.map((item: any) =>
          item.id === id && item.quantity > 1
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        ),
      }));
    };
  
  
    const increaseQuantity = (id:string) =>{
      useStore.setState((state:any) => ({
        wishlist:state.cart.map((item:any)=> item.id === id ? {
          ...item,
          quantity: (item.quantity ?? 1) + 1
        } : item )
      }))
    }

    const removeItem = (id:string) =>{
      removeFromCart(id,user,location,deviceInfo)
    }

    const subtotal = cart.reduce(
      (total:number,item:any) => total + item.quantity * item.sale_price,0
    )
  return (
    <div className="w-full bg-white">
      <div className="md:w-[80%] w-[95%] mx-auto min-h-screen">
        {/* breadcrumbs */}
        <div className="pb-[50px]">
          <h1 className="md:pt-[50px] font-medium text-[44px] leading-[1] mb-4 ">
            Shopping Cart
          </h1>

          <Link href={"/"} className="text-[#55585b] hover:underline">
            Home
          </Link>

          <span className="inline-block p-[1.5px] mx-1 bg-[#a8acb0] rounded-full"></span>
          <span className="text-[#55585b]">Cart</span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            Your cart is empty! Start adding products.
          </div>
        ) : (
          <div className="lg:flex items-start gap-10">
            <table className="w-full lg:w-[90%] border-collapse">
              <thead className="bg-[#f1f3f4]">
                <tr>
                  <th className="py-3 align-middle text-left pl-4">Product</th>
                  <th className="py-3 text-center align-middle">Price</th>
                  <th className="py-3 text-center align-middle">Quantity</th>

                  <th className="py-3 text-center align-middle"></th>
                </tr>
              </thead>

              <tbody>
                {cart?.map((item: any) => (
                  <tr key={item.id} className="border-b border-b-[#00000e] ">
                    <td className="flex items-center gap-3 p-4">
                      <Image
                        src={item.images[0]?.url}
                        alt="cart_image"
                        width={80}
                        height={80}
                        className="rounded"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>

                        {item?.selectedOptions && (
                          <div className="text-sm text-gray-500">
                            {item?.selectedOptions?.color && (
                              <span>
                                Color: {}
                                <span
                                  style={{
                                    backgroundColor:
                                      item?.selectedOptions?.color,
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "100%",
                                    display: "inline-block",
                                  }}
                                />
                              </span>
                            )}
                            {item?.selectedOptions.size && (
                              <span className="ml-2">
                                Size: {item?.selectedOptions?.size}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 text-lg text-center">
                      {item?.id === discountedProductId ? (
                        <div className="flex flex-col items-center ">
                          <span className="line-through text-gray-600 text-sm">
                            ${item.sale_price.toFixed(2)}
                          </span>{" "}
                          <span
                            className="
                            text-green-600 font-semibold"
                          >
                            $
                            {(
                              (item.sale_price * (100 - discountPercent)) /
                              100
                            ).toFixed(2)}
                          </span>
                          <span className="text-xs text-green-700 bg-green-200">
                            Discount Applied
                          </span>
                        </div>
                      ) : (
                        <span>${item?.sale_price.toFixed(2)}</span>
                      )}
                    </td>
                    <td>
                        <div className="flex justify-center items-center border border-gray-200 rounded-[200px] w-[90px] p-[2px]">
                        <button
                          className="text-black cursor-pointer text-xl"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          -
                        </button>
                        <span className="px-4">{item?.quantity}</span>
                        <button className="text-black cursor-pointer text-xl"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>
{/* update */}
                    <td>
                      <button className="px-4 py-2 text-red-500 hover:text-red-700 font-bold transition duration-200 rounded-md cursor-pointer "
                      onClick={()=> removeItem(item?.id)}
                      >
                       x Remove

                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
