"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineFormatAlignLeft } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";
import { NavItems } from "../../configs/contants";
import Link from "next/link";
import { IoPerson } from "react-icons/io5";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import useUSer from "../../hooks/useHook";

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const {user,isLoading} = useUSer()
 

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg " : "relative"
      }`}
    >
      <div
        className={`w-[80%] m-auto relative flex items-center justify-between ${
          isSticky ? "pt-3" : "py-0"
        }`}
      >
        {/* all dropdowns */}
        <div
          className={`w-[260px] cursor-pointer ${
            isSticky && "-mb-2"
          } flex items-center justify-between px-5 h-[50px] bg-[#3489ff] `}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <MdOutlineFormatAlignLeft color="white" />
            <span className="text-white font-medium">All Departments</span>
          </div>
          <FaChevronDown color="white" />
        </div>

        {/* dropdown menu */}
        {show && (
          <div
            className={`absolute left-0 w-[260px] h-[400px] bg-[#f5f5f5] ${
              isSticky ? "top-[70px]" : "top-[50px]"
            } `}
          ></div>
        )}

        {/* navigation links */}
        <div className="flex items-center">
          {NavItems.map((i: NavItemsType, index: number) => (
            <Link
              href={i.href}
              className="px-5 font-medium text-lg"
              key={index}
            >
              {i.title}
            </Link>
          ))}
        </div>
        <div>
          {isSticky && (
            <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            {!isLoading && user ? (
              <>
                <Link href={"/profile"} className="border-2 w-[50px] h-[50px] rounded-full flex items-center justify-center border-gray-500">
                  <IoPerson size={20} />
                </Link>

                <Link href={"/profile"}>
                  <span className="block font-medium">Hello,</span>
                  <span className="font-medium">{user?.name?.split(" ")[0]}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={"/login"}
                  className="border-2 w-[50px] h-[50px] rounded-full flex items-center justify-center border-gray-500"
                >
                  <IoPerson size={20} />
                </Link>
                <Link href={"/"}>
                  <span className="block font-medium">Hello,</span>
                  <span className="font-medium">{isLoading ? "..." : "Sign In"}</span>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-5">
            <Link href={"/wishlist"} className="relative">
              <CiHeart size={30} />
              <div className="w-5 h-5 rounded-full bg-red-500 border-white flex justify-center items-center absolute top-[-5px] right-[-5px]">
                <span className="text-white font-semibold text-sm">0</span>
              </div>
            </Link>
            <Link href={"/cartlist"} className="relative">
              <CiShoppingCart size={30} />
              <div className="w-5 h-5 rounded-full bg-red-500 border-white flex justify-center items-center absolute top-[-5px] right-[-5px]">
                <span className="text-white font-semibold text-sm">0</span>
              </div>
            </Link>
          </div>
        </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
