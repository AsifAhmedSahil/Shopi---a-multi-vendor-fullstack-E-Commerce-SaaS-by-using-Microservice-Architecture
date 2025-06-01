import crypto from "crypto"
import { ValidationError } from "../../../../packages/error-handler";
import { NextFunction } from "express";
import redis from "../../../../packages/lib/redis";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data:any,userType:"user" | "seller") =>{
    const {name,email,password,phone_number,country} = data;

    if(!name || !email || !password (userType === "seller" && (!phone_number || !country))){
        throw new ValidationError("missing required fields!")

    }

    if(!emailRegex.test(email)){
        throw new ValidationError("Invalid Email format!")
    }


}


  export const checkOTPRestrictions = (email:string , next: NextFunction) =>{
        

    }

export const sendOTP = async (name:string,email:string,template:string) =>{
    const otp = crypto.randomInt(1000,9999).toString()

    await redis.set(`otp:${email}`,otp,"EX",300)
    await redis.set(`otp_cooldown:${email}`,"true","EX",60)
    



}