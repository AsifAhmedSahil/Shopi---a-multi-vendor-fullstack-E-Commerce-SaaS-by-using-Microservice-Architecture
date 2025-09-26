import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
} from "@packages/error-handler";
import prisma from "@packages/lib/prisma";
import { ObjectId } from "mongodb";
import { NextFunction, Request, Response } from "express";
import { imagekit } from "@packages/lib/imagekit";
import { Prisma } from "@prisma/client";

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
      data: {
        public_name,
        discountCode,
        discountType,
        discountValue: parseFloat(discountValue),
        sellerId: req.seller.id,
      },
    });

    res.status(201).json({
      success: true,
      discount_code,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getDiscountCode = async (req: any, res: Response) => {
  try {
    if (!req.seller || !req.seller.id) {
      console.log("Seller not authenticated or req.seller missing");
      return res.status(401).json({ message: "Seller not authenticated" });
    }
    console.log(req.seller.id);

    const discount_codes = await prisma.discount_codes.findMany({
      // where: { sellerId: new ObjectId(req.seller.id) as unknown as string },
      where: { sellerId: req.seller.id },
    });

    console.log(discount_codes);

    return res.status(200).json({
      message: "Discount codes fetched successfully",
      discount_codes,
    });
  } catch (error) {
    console.error("Error fetching discount codes:", error);
    return res.status(500).json({
      message: "Internal server error",
      // error: error.message,
    });
  }
};

export const deleteDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sellerId = req.seller?.id;

    const discountCodes = await prisma.discount_codes.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });

    if (!discountCodes) {
      return next(new NotFoundError("Discount code not found!"));
    }
    if (discountCodes.sellerId !== sellerId) {
      return next(new ValidationError("Unauthorized Access!"));
    }

    await prisma.discount_codes.delete({ where: { id } });

    return res
      .status(200)
      .json({ message: "Discount code successfully deleted!" });
  } catch (error) {
    next(error);
  }
};

// upload product image
export const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { file } = req.body;

    const response = await imagekit.upload({
      file: file,
      fileName: `product-${Date.now()}.jpg`,
      folder: "/products",
    });
    console.log(response);
    res.status(201).json({
      file_url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    next(error);
  }
};

// delete product image

export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.body;
    console.log(fileId);
    const response = await imagekit.deleteFile(fileId);
    console.log(response);

    res.status(201).json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
};

// create product

export const createProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      short_description,
      detailed_description,
      warranty,
      custom_specifications,
      slug,
      tags,
      cash_on_delivery,
      brand,
      video_url,
      category,
      colors = [],
      sizes = [],
      discountCodes,
      stock,
      sale_price,
      regular_price,
      subCategory,
      customProperties = {},
      images = [],
    } = req.body;

    console.log("Images to create:", images);

    if (
      !title ||
      !slug ||
      !short_description ||
      !category ||
      !subCategory ||
      !sale_price ||
      !images ||
      !tags ||
      !stock ||
      !regular_price
    ) {
      return next(new ValidationError("Missing required fields!"));
    }

    if (!req.seller.id) {
      return next(new AuthenticationError("only seller can create products!"));
    }

    const slugChecking = await prisma.products.findUnique({
      where: {
        slug,
      },
    });

    if (slugChecking) {
      return next(
        new ValidationError("Slug already exist! Please use a different slug!")
      );
    }

    const newProduct = await prisma.products.create({
      data: {
        title,
        short_description,
        detailed_description,
        warranty,
        cashOnDelivery: cash_on_delivery,
        slug,
        shopId: req.seller?.shop?.id!,
        tags: Array.isArray(tags) ? tags : tags.split(","),
        brand,
        video_url,
        category,
        subCategory,
        colors: colors || [],
        discount_codes: discountCodes?.map((codeId: string) => codeId),
        sizes: sizes || [],
        stock: parseInt(stock),
        sale_price: parseFloat(sale_price),
        regular_price: parseFloat(regular_price),
        custom_properties: customProperties || {},
        custom_specifications: custom_specifications || {},
        images: {
          create: images
            .filter((img: any) => img && img.fileId && img.file_url)
            .map((img: any) => ({
              file_id: img.fileId,
              url: img.file_url,
            })),
        },
      },
      include: { images: true },
    });

    res.status(201).json({
      success: true,
      newProduct,
    });
  } catch (error) {
    console.log(error);
  }
};

// get logged in seller products

export const getShopProducts = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        shopId: req.seller?.shop?.id,
      },
      include: {
        images: true,
      },
    });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
  }
};

// delete product

export const deleteProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, shopId: true, isDeleted: true },
    });

    if (!product) {
      return next(new ValidationError("product not found!"));
    }

    if (product.shopId !== sellerId) {
      return next(new ValidationError("unauthorized action"));
    }

    if (product.isDeleted) {
      return next(new ValidationError("product is already deleted!"));
    }

    const deletedProduct = await prisma.products.update({
      where: { id: productId },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return res.status(200).json({
      message:
        "product is scheduled for deletion in 24 hours, You can restore it within this time ",
      deletedAt: deletedProduct.deletedAt,
    });
  } catch (error) {
    console.log(error);
  }
};

// restore product

export const restoreProduct = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, shopId: true, isDeleted: true },
    });

    if (!product) {
      return next(new ValidationError("product is not  in database!"));
    }

    if (product.shopId !== sellerId) {
      return next(new ValidationError("Unauthorized access!"));
    }

    if (!product.isDeleted) {
      return res
        .status(400)
        .json({ message: "Product is not in deleted state!" });
    }

    await prisma.products.update({
      where: { id: productId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return res.status(200).json({ message: "Product successfully restored" });
  } catch (error) {
    // console.log(error)
    return res.status(500).json({ message: "Error restoring product", error });
  }
};

// get all products

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    const baseFilter = {
      isDeleted: false, // ✅ only fetch active products
    };

    const orderBy: Prisma.productsOrderByWithRelationInput =
      type === "latest"
        ? { createdAt: "desc" }
        : { totalSales: "desc" };

    const [products, total, top10products] = await Promise.all([
      prisma.products.findMany({
        skip,
        take: limit,
        include: {
          images: true,
          Shop: true,
        },
        where: baseFilter,
        orderBy,
      }),

      prisma.products.count({ where: baseFilter }),

      prisma.products.findMany({
        take: 10,
        where: baseFilter,
        orderBy,
      }),
    ]);

    res.status(200).json({
      products,
      top10By: type === "latest" ? "latest" : "topSales",
      top10products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

