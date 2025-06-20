import { NextFunction, Request, Response } from "express";
import {
  checkOTPRestrictions,
  handleForgotPassword,
  handleVerifyUserForgotPassword,
  sendOTP,
  trackOtpRequest,
  validateRegistrationData,
  verifyOtp,
} from "../utils/auth.helper";
import prisma from "@packages/lib/prisma";
import { AuthenticationError, ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookies";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

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
    setCookie(res, "access_token", accessToken);
    setCookie(res, "refresh_token", refreshToken);

    res.status(200).json({
      message: "Login Successful!",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// refresh token user
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return new ValidationError("Unauthorized, no refresh token!");
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN as string
    ) as { id: string; role: string };

    if (!decoded || !decoded.id || decoded.role) {
      return new JsonWebTokenError("Forbidden!, invalid refresh token");
    }

    const user = await prisma.users.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return new AuthenticationError("user / seller not found!");
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    setCookie(res, "access_token", newAccessToken);
    return res.status(201).json({ success: true });
  } catch (error) {}
};

// get logged in user
export const getUser = (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// register a new seller
export const registerSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "seller");
    const { name, email } = req.body;

    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });

    if (existingSeller) {
      throw new ValidationError(
        "the seller is already exists with this email!"
      );
    }

    await checkOTPRestrictions(email, next);
    await trackOtpRequest(email, next);
    await sendOTP(name, email, "seller-activation");

    res
      .status(200)
      .json({ message: "OTP send to email.Please verify your account!" });
  } catch (error) {}
};

// verify seller with otp
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name, phone_number, country } = req.body;
    if (!email || !otp || !password || !name || !phone_number || !country) {
      return next(new ValidationError("All field are required!"));
    }

    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });

    if (existingSeller) {
      throw new ValidationError(
        "the seller is already exists with this email!"
      );
    }

    await verifyOtp(email, otp, next);
    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await prisma.sellers.create({
      data: {
        name,
        email,
        password: hashedPassword,
        country,
        phone_number,
      },
    });

    res.status(201).json({ seller, message: "Seller registered successfull!" });
  } catch (error) {}
};

// create a new shop
export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, bio, address, opening_hours, website, category, sellerId } =
      req.body;

    if (
      !name ||
      !bio ||
      !address ||
      !opening_hours ||
      !website ||
      !category ||
      !sellerId
    ) {
      return next(new ValidationError("All field are required! "));
    }

    const shopData: any = {
      name,
      bio,
      address,
      opening_hours,
      category,
      sellerId,
    };

    if (website && website.trim !== "") {
      shopData.website = website;
    }

    const shop = await prisma.shops.create({
      data: shopData,
    });

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {}
};

// user forgot password
export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleForgotPassword(req, res, next, "user");
};

// *verify forgot password otp

export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleVerifyUserForgotPassword(req, res, next);
};

// * reset user password

export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) throw new ValidationError("User not found!");

    const isSamePassword = await bcrypt.compare(newPassword, user.password!);

    if (isSamePassword)
      throw new ValidationError("Password can not same as previous one!");

    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      message: "Password reset successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// create stripe connect account

export const createStripeConnectLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId } = req.body;
    if (!sellerId) return next(new ValidationError("Seller ID is required!"));

    const seller = await prisma.sellers.findUnique({ where: { id: sellerId } });

    if (!seller) return next(new ValidationError("Seller not found!"));

    const account = await stripe.accounts.create({
      type: "express",
      email: seller?.email,
      country: "BD",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    await prisma.sellers.update({
      where: {
        id: sellerId,
      },
      data: {
        stripeId: account.id,
      },
    });

    const accountLinks = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "http://localhost:3000/success",
      return_url: "http://localhost:3000/success",
      type: "account_onboarding",
    });

    res.json({ url: accountLinks.url });
  } catch (error) {
    return next(error)
  }
};

// login seller
export const loginSeller = async(req: Request,
  res: Response,
  next: NextFunction) =>{
    try {
      const {email,password} = req.body;
      if(!email || !password) return next(new ValidationError("Email and password are required"))

        const seller = await prisma.sellers.findUnique({where:{email}})

        if(!seller) return next(new ValidationError("Invalid email and password!"))

        // verify password
        const isMatch = await bcrypt.compare(password,seller.password)
        if(!isMatch) return next(new ValidationError("Invalid email or password"))

          // generate access and refresh token
          const accessToken = jwt.sign(
            {id:seller.id, role:"seller"},
            process.env.ACCESS_TOKEN_SECRET as string,
            {expiresIn:"15m"}
          )
          const refreshToken = jwt.sign(
            {id:seller.id, role:"seller"},
            process.env.REFRESH_TOKEN_SECRET as string,
            {expiresIn:"7d"}
          )

          // store refresh and access token
          setCookie(res,"seller-refresh-token",refreshToken),
          setCookie(res,"seller-access-token",accessToken)

          
    return res.status(200).json({
      message: "Login successful",
      seller: {
        id: seller.id,
        email: seller.email,
        // any other non-sensitive fields
      }
    });

    } catch (error) {
      next(error)
    }

}

// get logged in seller

export const getSeller = async(
  req: any,
  res: Response,
  next: NextFunction
) =>{
  try {
    const seller = req.seller;
    res.status(201).json({
      success:true,
      seller 
    })
  } catch (error) {
    next(error) 
  }
}