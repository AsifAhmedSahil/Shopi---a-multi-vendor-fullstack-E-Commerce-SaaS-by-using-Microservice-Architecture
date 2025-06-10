"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";

type FormData = {
    name:string,
  email: string;
  password: string;
};

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {};
  return (
    <div className="w-full min-h-[85vh] py-10 bg-[#f1f1f1]">
      <h1 className="text-center text-4xl font-bold text-black font-Poppins">
        Sign Up
      </h1>
      <p className="text-gray-800 text-center py-3 font-medium text-lg">
        Home . sign up
      </p>

      <div className="w-full flex justify-center">
        <div className="md:w-[480px] bg-white p-8 shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Sign Up To Shopi
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Already Have An Account?{" "}
            <Link href={"/login"} className="text-blue-500">
              Login
            </Link>
          </p>
          <div className="w-full flex justify-center">
            <button
              type="button"
              className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2 justify-center "
            >
              <svg
                className="w-4 h-4 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 19"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                  clip-rule="evenodd"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="flex items-center py-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3">or sign up with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="name"
              placeholder="Enter Your Name"
              className="w-full p-2 border border-gray-400 !rounded mb-1 outline-0"
              {...register("name", {
                required: "Name is required!",
                
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {String(errors.name.message)}
              </p>
            )}
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full p-2 border border-gray-400 !rounded mb-1 outline-0"
              {...register("email", {
                required: "Email is required!",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid Email Address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {String(errors.email.message)}
              </p>
            )}

            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter Your Password"
                className="w-full p-2 border border-gray-400 !rounded mb-1 outline-0"
                {...register("password", {
                  required: "Password is required!",
                  minLength: {
                    value: 6,
                    message: "Password minimun 6 character long",
                  },
                })}
              />

              <button
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xl"
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <IoEye /> : <IoEyeOff />}
              </button>

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {String(errors.password.message)}
                </p>
              )}
            </div>
           
            <button className="w-full bg-black text-white mt-4 py-2 rounded-lg text-lg">
              Sign Up
            </button>
            {serverError && (
              <p className="text-red-500 text-sm mt-4">{serverError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
