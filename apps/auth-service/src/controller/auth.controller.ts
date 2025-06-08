import { NextFunction, Request, Response } from "express";
import {
  checkOTPRestrictions,
  sendOTP,
  trackOtpRequest,
  validateRegistrationData,
  verifyOtp,
} from "../utils/auth.helper";
import prisma from "@packages/lib/prisma";
import { AuthenticationError, ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookies";

// register with new user

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");

    const { name, email } = req.body;

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ValidationError("User already exist with this email!"));
    }

    await checkOTPRestrictions(email, next);
    await trackOtpRequest(email, next);
    await sendOTP(name, email, "user-activation-mail");

    res.status(200).json({
      message: "OTP send to email, please verify your account",
    });
  } catch (error) {
    console.log(error);
  }
};

//  verify user with otp
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name, otp } = req.body;
  if (!email || !password || !name || !otp) {
    return next(new ValidationError("All fields are required!"));
  }

  const existingUser = await prisma.users.findUnique({ where: { email } });

  if (existingUser) {
    return next(new ValidationError("User already exist with this email!"));
  }

  await verifyOtp(email, otp, next);
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.users.create({
    data: { name, email, password: hashedPassword },
  });

  res.status(201).json({
    success: true,
    message: "user registered successfully!",
  });
};

// login user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("All field are required!");
  }

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    throw new AuthenticationError("User doesn't exist!");
  }

  // verify password
  const isMatchPassword = await bcrypt.compare(password, user.password!);
  if (!isMatchPassword) {
    throw new AuthenticationError("Wrong Password or email!");
  }

  // generate access and refresh token

  const accessToken = jwt.sign(
    { id: user.id, role: "user" },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user.id, role: "user" },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );

  // store to the cookies**
  setCookie(res,"access_token",accessToken)
  setCookie(res,"refresh_token",refreshToken)

  res.status(200).json({
    message:"Login Successful!",
    user:{id:user.id,name:user.name,email:user.email}
  })



  } catch (error) {
    console.log(error)
    
  }
};
