import { NextFunction, Request, Response } from "express";
import {
  checkOTPRestrictions,
  sendOTP,
  trackOtpRequest,
  validateRegistrationData,
  verifyOtp,
} from "../utils/auth.helper";
import prisma from "@packages/lib/prisma";
import { ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";

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
