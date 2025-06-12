"use client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import toast from "react-hot-toast";

type FormData = {
  email: string;
  password: string;
};

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
        { email }
      );
      return response.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email),
        setStep("otp"),
        setServerError(null),
        setCanResend(false),
        startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Invalid Credentials!";
      setServerError(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
        {
          email: userEmail,
          otp: otp.join(""),
        }
      );

      return response.data;
    },
    onSuccess: () => {
      setStep("reset");
      setServerError(null);
    },
  });
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!password) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
        {
          email: userEmail,
          newPassword: password,
        }
      );

      return response.data;
    },
    onSuccess: () => {
      setStep("email");
      toast.success("Password reset successfully");
      setServerError(null);
      router.push("/login");
    },
  });

  const handleChangeOtp = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmitEmail = ({ email }: { email: string }) => {
    requestOtpMutation.mutate({ email });
  };

  const onSubmitPassword = ({ password }: { password: string }) => {
    resetPasswordMutation.mutate({ password });
  };

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-user`,
        data,
        { withCredentials: true }
      );

      return response.data;
    },

    onSuccess: (data) => {
      setServerError(null);
      router.push("/");
    },

    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Invalid Credentials!";
      setServerError(errorMessage);
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full min-h-[85vh] py-10 bg-[#f1f1f1]">
      <h1 className="text-center text-4xl font-bold text-black font-Poppins">
        Forgot Password
      </h1>
      <p className="text-gray-800 text-center py-3 font-medium text-lg">
        Home . forgot-password
      </p>

      <div className="w-full flex justify-center">
        {step === "email" && (
          <>
            <div className="md:w-[480px] bg-white p-8 shadow rounded-lg">
              <h3 className="text-3xl font-semibold text-center mb-2">
                Login To Shopi
              </h3>
              <p className="text-center text-gray-500 mb-4">
                Go to login?{" "}
                <Link href={"/login"} className="text-blue-500">
                  login
                </Link>
              </p>

              <form onSubmit={handleSubmit(onSubmitEmail)}>
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

                <button
                  disabled={requestOtpMutation.isPending}
                  className="w-full mt-4 bg-black text-white py-2 rounded-lg text-lg"
                >
                  {resetPasswordMutation.isPending ? "Sending OTP" : "Submit"}
                </button>
                {serverError && (
                  <p className="text-red-500 text-sm mt-4">{serverError}</p>
                )}
              </form>
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <div>
              <h3 className="text-center font-semibold mb-4 text-xl">
                Enter OTP
              </h3>

              <div className="flex justify-center gap-6">
                {otp?.map((digit, index) => (
                  <input
                    type="text "
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    value={digit}
                    maxLength={1}
                    className="h-12 w-12 text-center border border-gray-300 outline-none !rounded"
                    onChange={(e) => handleChangeOtp(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
              <button
                className="cursor-pointer text-lg w-full text-center bg-blue-500 text-white rounded-lg py-2 mt-4 font-semibold "
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? "Verifying" : "Verify OTP"}
              </button>
              <p className="text-center text-sm mt-4">
                {canResend ? (
                  <button
                    onClick={() => {
                      requestOtpMutation.mutate({ email: userEmail! });
                    }}
                    className="text-blue-500 cursor-pointer"
                  >
                    Resend OTP
                  </button>
                ) : (
                  `Resend OTP in ${timer}s`
                )}
              </p>

              {verifyOtpMutation.isError &&
                verifyOtpMutation.error instanceof AxiosError && (
                  <p className="text-red-500 text-sm">
                    {verifyOtpMutation.error.response?.data.message ||
                      verifyOtpMutation.error.message}
                  </p>
                )}
            </div>
          </>
        )}

        {step === "reset" && (
          <div className="flex flex-col bg-white px-24 py-12">
            <h3 className="text-center text-2xl font-semibold mb-6">
              Reset Password
            </h3>

            <form
              onSubmit={handleSubmit(onSubmitPassword)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-1"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  {...register("password", {
                    required: "Password is required!",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.password.message)}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="w-full bg-black text-white py-2 rounded-md text-lg hover:bg-gray-900 transition disabled:opacity-50"
              >
                {resetPasswordMutation.isPending
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
