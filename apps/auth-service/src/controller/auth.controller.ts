import { NextFunction, Request, Response } from "express";
import {
  checkOTPRestrictions,
  sendOTP,
  trackOtpRequest,
  validateRegistrationData,
} from "../utils/auth.helper";
import prisma from "@packages/lib/prisma";
import { ValidationError } from "@packages/error-handler";

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");

    const { name, email } = req.body;

    const existingUser = await prisma.users.findUnique({ where: {email} });

    if (existingUser) {
      return next(new ValidationError("User already exist with this email!"));
    }

    await checkOTPRestrictions(email, next);
    await trackOtpRequest(email, next);
    await sendOTP( name,email, "user-activation-mail");

    res.status(200).json({
      message: "OTP send to email, please verify your account",
    });
  } catch (error) {
    console.log(error);
  }
};
