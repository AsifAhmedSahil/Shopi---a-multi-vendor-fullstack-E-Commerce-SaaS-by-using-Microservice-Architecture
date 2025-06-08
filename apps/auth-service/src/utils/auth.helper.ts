import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import { NextFunction, Request, Response } from "express";
import redis from "../../../../packages/lib/redis";
import { sendEmail } from "./sendEmail";
import prisma from "@packages/lib/prisma";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError("missing required fields!");
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid Email format!");
  }
};

export const checkOTPRestrictions = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Account locked due to multiple failed attempt! Try again after 30 minutes...!"
      )
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Too Mmany OTP Request! Please wait for 1 hr before requesting again!"
      )
    );
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError("Please wait 1 minute before requesting a new otp!")
    );
  }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);
    return next(
      new ValidationError(
        "Too many OTP requests. Please wait 1 hr before requesting again."
      )
    );
  }

  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600);
};

export const sendOTP = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Vrify your email", template, { name, otp });

  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    throw new ValidationError("Can not find otp in redis database!");
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

  // * if user otp not match and user try more than 2 times then otp locked for 30 minutes!
  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800);
      await redis.del(`otp:${email}`, failedAttemptsKey);
      throw new ValidationError(
        "Too many otp request failed! Your acccount is locked for 30 minutes!"
      );
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);
    throw new ValidationError(
      `Incorrect OTP. ${2 - failedAttempts} attempt left!`
    );
  }

  await redis.del(`otp:${email}`, failedAttemptsKey);
};

export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError("Email is required!");
    }

    // * find seller or user in the DB
    const user =
      userType === "user" &&
      (await prisma.users.findUnique({ where: { email } }));

    if (!user) throw new ValidationError(`${userType} not found!`);

    // check OTP Restrictions
    await checkOTPRestrictions(email, next), await trackOtpRequest(email, next);

    // generate OTP and send to the mail
    await sendOTP(email, user.name, "forgot-password-user-mail");

    res
      .status(200)
      .json({ message: "OTP send to the mail,Please verigy your account!" });
  } catch (error) {
    next(error);
  }
};

export const handleVerifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) throw new ValidationError("Email and OTP Required!");

    await verifyOtp(email, otp, next);

    res.status(200).json({
      message: "OTP Verified. You can not reset your password!",
    });
  } catch (error) {
    next(error);
  }
};
