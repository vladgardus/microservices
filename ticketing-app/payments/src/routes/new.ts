import express, { NextFunction, Request, Response } from "express";
import { isAuthenticated, validateRequest, BadRequestError, UnauthorizedError, OrderStatus, DatabaseConnectionError, Patterns } from "@vgticketingapp/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import Stripe from "stripe";
import { Payment, PaymentMapper } from "../models/payment";
import { startSession } from "mongoose";
import { PublishEvent } from "../models/publish-event";

const router = express.Router();

router.post("/payments", isAuthenticated, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  const { token, orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    next(new BadRequestError("order not found"));
    return;
  }
  if (order.userId != req.user?.id) {
    next(new UnauthorizedError());
    return;
  }
  if (order.status === OrderStatus.Canceled) {
    next(new BadRequestError("Cannot pay for a canceled order"));
    return;
  }

  const SESSION = await startSession();
  try {
    SESSION.startTransaction();
    let charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: "usd",
      source: token,
    });

    const payment = Payment.build({ orderId, stripeId: charge.id });
    await payment.save();

    const newMessage = PublishEvent.build({ message: JSON.stringify(PaymentMapper.toDTO(payment)), pattern: Patterns.PaymentCreated });
    await newMessage.save();

    res.send(PaymentMapper.toDTO(payment));
  } catch (err) {
    await SESSION.abortTransaction();
    if (err instanceof Stripe.errors.StripeAPIError) {
      next(new BadRequestError(err.message));
      return;
    } else if (err instanceof Stripe.errors.StripeInvalidRequestError) {
      next(new BadRequestError(err.message));
      return;
    } else {
      next(new DatabaseConnectionError());
      return;
    }
  } finally {
    SESSION.endSession();
  }
});

export { router as createPaymentRouter };
