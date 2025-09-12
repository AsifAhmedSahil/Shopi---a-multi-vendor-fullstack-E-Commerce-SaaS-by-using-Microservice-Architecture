import prisma from "@packages/lib/prisma";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies["access-token"] ||
      req.cookies["seller-access-token"] ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token not found!" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: "user" | "seller";
    };

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized, invalid token !" });
    }

    let account;

    if (decoded.role === "seller") {
      account = await prisma.sellers.findUnique({
        where: { id: decoded.id },
        include: { shop: true },
      });
      req.seller = account;
      console.log("Seller found in middleware:", account);
    } else if (decoded.role === "user") {
      account = await prisma.users.findUnique({ where: { id: decoded.id } });
      req.user = account;
    }

    if (!account) {
      return res.status(401).json({ message: "Account not found!" });
    }

    req.role = decoded.role;

    next();
  } catch (error) {
    console.error("Middleware error:", error);
    return res.status(401).json({ message: "Unauthorized, invalid token !" });
  }
};

