import Link from "next/link";
import React from "react";
import { Search } from "lucide-react";
import { IoPerson } from "react-icons/io5";
import { CiHeart,CiShoppingCart } from "react-icons/ci";
import HeaderBottom from "./HeaderBottom";


const Header = () => {
  return (
    <div className="w-full bg-white">
      <div className="w-[80%] m-auto py-5 flex items-center justify-between">
        <div>
          <Link href={"/"}>
            <span className="text-3xl font-[500]">Shopi</span>
          </Link>
        </div>

        <div className="w-[50%] relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 border-[2.5px] font-poppins font-medium border-[#3489FF] outline-none h-[55px]"
          />

          <div className="w-[60px] flex justify-center items-center bg-[#3489FF] h-[55px] absolute top-0 right-0 cursor-pointer">
            <Search color="#fff" />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Link
              href={"/login"}
              className="border-2 w-[50px] h-[50px] rounded-full flex items-center justify-center border-gray-500"
            >
              <IoPerson size={20} />
            </Link>
            <Link href={"/"}>
              <span className="block font-medium">Hello,</span>
              <span className="font-medium">Sign In</span>
            </Link>
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
      </div>

      <div className="border-b border-b-[#99999938]"/>

      <HeaderBottom/>
    </div>
  );
};

export default Header;
