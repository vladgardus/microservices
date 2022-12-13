import { isAuthenticated, NotFoundError, UnauthorizedError, DatabaseConnectionError, Patterns, OrderStatus, OrderCanceledEvent } from "@vgticketingapp/common";
import express, { NextFunction, Request, Response } from "express";
import { Order, OrderMapper } from "../models/order";
import { startSession } from "mongoose";
import { PublishEvent } from "../models/publish-event";
import { TicketMapper } from "../models/ticket";

const router = express.Router();

router.delete("/orders/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("ticket");
  if (!order) {
    next(new NotFoundError());
    return;
  }
  if (order.userId != req.user?.id) {
    next(new UnauthorizedError());
    return;
  }
  const SESSION = await startSession();
  try {
    SESSION.startTransaction();
    order.set({ status: OrderStatus.Canceled });
    await order.save();
    const message: OrderCanceledEvent["data"] = OrderMapper.toDTO(order, req.user!.id);
    message.ticket = TicketMapper.toDTO(order.ticket);
    const newMessage = PublishEvent.build({ message: JSON.stringify(message), pattern: Patterns.OrderCanceled });
    await newMessage.save();
    await SESSION.commitTransaction();
    res.send(OrderMapper.toDTO(order, req.user.id));
  } catch (err) {
    await SESSION.abortTransaction();
    throw new DatabaseConnectionError();
  } finally {
    SESSION.endSession();
  }
});

export { router as deleteOrderRouter };
