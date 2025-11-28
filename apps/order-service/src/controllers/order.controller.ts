import { ValidationError } from "@packages/error-handler";
import prisma from "@packages/lib/prisma";
import redis from "@packages/lib/redis";
import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

// createPaymentIntent
export const createPaymentIntent = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { amount, sessionId, sellerStripeAccountId } = req.body;

  const customerAmount = Math.round(amount * 100);
  const platformFee = Math.floor(customerAmount * 0.1);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: customerAmount,
      currency: "usd",
      payment_method_types: ["card"],
      application_fee_amount: platformFee,
      transfer_data: {
        destination: sellerStripeAccountId,
      },
      metadata: {
        sessionId,
        userId: req.user.id,
      },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

// create payment session

export const createPaymentSession = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cart, selectedAddressId, coupon } = req.body;
    const userId = req.user.id;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return next(new ValidationError("Cart is empty or invalid."));
    }

    const normalizedCart = JSON.stringify(
      cart
        .map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          sale_price: item.sale_price,
          shopId: item.shopId,
          selectedOptions: item.selectedOptions || {},
        }))
        .sort((a, b) => a.id.localCompare(b.id))
    );

    const keys = await redis.keys("payment-session:*");
    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        const session = JSON.parse(data);
        if (session.userId === userId) {
          const existingCart = JSON.stringify(
            session.cart
              .map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                sale_price: item.sale_price,
                shopId: item.shopId,
                selectedOptions: item.selectedOptions || {},
              }))
              .sort((a: any, b: any) => a.id.localCompare(b.id))
          );

          if (existingCart === normalizedCart) {
            return res.status(200).json({ sessionId: key.split(":")[1] });
          } else {
            await redis.del(key);
          }
        }
      }
    }

    // fetch sellers and their stripe account for creating order
    const uniqueShopIds = [...new Set(cart.map((item: any) => item.shopId))];

    const shops = await prisma.shops.findMany({
      where: {
        id: { in: uniqueShopIds },
      },
      select: {
        id: true,
        sellerId: true,
        seller: {
          select: {
            stripeId: true,
          },
        },
      },
    });

    const sellerData = shops.map((shop) => ({
      shopId: shop.id,
      sellerId: shop.sellerId,
      stripeAccountId: shop?.seller?.stripeId,
    }));

    // calculate total

    const totalAmount = cart.reduce((total: number, item: any) => {
      return total + item.quantity * item.sale_price;
    }, 0);

    // create session payload

    const sessionId = crypto.randomUUID();

    const sessionData = {
      userId,
      cart,
      sellers: sellerData,
      totalAmount,
      shippingAddressId: selectedAddressId || null,
      coupon: coupon || null,
    };

    await redis.setex(
      `payment-session:${sessionId}`,
      600, // 10 min
      JSON.stringify(sessionData)
    );

    return res.status(201).json({ sessionId });
  } catch (error) {
    next(error);
  }
};

// verify payment session

export const verifyingPaymentSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required." });
    }

    // fetch session from redis
    const sessionKey = `payment-session:${sessionId}`;
    const sessionData = await redis.get(sessionKey);

    if (!sessionData) {
      return res.status(400).json({ error: "Session Not Found" });
    }

    // parse and return session
    const session = JSON.parse(sessionData);
    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};
