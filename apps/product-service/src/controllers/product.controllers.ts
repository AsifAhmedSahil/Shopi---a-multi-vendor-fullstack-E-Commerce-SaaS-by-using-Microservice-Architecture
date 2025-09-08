import { ValidationError } from "@packages/error-handler";
import prisma from "@packages/lib/prisma";
import { NextFunction, Request, Response } from "express";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = await prisma.site_config.findFirst();
    if (!config) {
      return res.status(404).json({ message: "Categories not found" });
    }

    return res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error) {
    console.log(error);
  }
};

export const createDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { public_name, discountType, discountValue, discountCode } = req.body;

    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: {
        discountCode,
      },
    });

    if (isDiscountCodeExist) {
      return next(
        new ValidationError(
          "Discount code always avaiable please use a different code!"
        )
      );
    }
    const discount_code = await prisma.discount_codes.create({
        data:{
            public_name,
            discountCode,
            discountType,
            discountValue: parseFloat(discountValue),
            sellerId: req.seller.id 
        }
    });

    res.status(201).json({
        success: true,
        discount_code,
    })
  } catch (error) {
    console.log(error);
  }
};
