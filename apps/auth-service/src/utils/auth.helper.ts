import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import { NextFunction, Request, Response } from "express";
import redis from "../../../../packages/lib/redis";
import { sendEmail } from "./sendEmail";

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

export const trackOtpRequest = async(email:string,next:NextFunction) =>{
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0")

    if(otpRequests >= 2){
        await redis.set(`otp_spam_lock:${email}`,"locked","EX",3600);
        return next(
            new ValidationError("Too many OTP requests. Please wait 1 hr before requesting again.")
        )
    }

    await redis.set(otpRequestKey,otpRequests+1, "EX" , 3600)
}

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

export const verifyOtp = async (email:string,otp:string,next:NextFunction) =>{
  const storedOtp = await redis.get(`otp:${email}`)
  if(!storedOtp){
    return next(new ValidationError("Can not find otp in redis database!"))
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt(await redis.get(failedAttemptsKey) || "0") 

  // * if user otp not match and user try more than 2 times then otp locked for 30 minutes!
  if(storedOtp !== otp){
    if(failedAttempts >= 2){
      await redis.set(`otp_lock:${email}`,"locked","EX",1800)
      await redis.del(`otp:${email}`,failedAttemptsKey);
      return next(new ValidationError("Too many otp request failed! Your acccount is locked for 30 minutes!"))
    }
    await redis.set(failedAttemptsKey,failedAttempts + 1,"EX",300)
    return next(new ValidationError(`Incorrect OTP. ${2 - failedAttempts} attempt left!`))
  }

  await redis.del(`otp:${email}`,failedAttemptsKey)

}
