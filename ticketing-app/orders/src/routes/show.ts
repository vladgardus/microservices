import { isAuthenticated, NotFoundError, UnauthorizedError } from "@vgticketingapp/common";
import express, { NextFunction, Request, Response } from "express";
import { Order, OrderMapper } from "../models/order";

const router = express.Router();

router.get("/orders/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
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
  res.status(200).send(OrderMapper.toDTO(order, req.user?.id));
});

export { router as showOrderRouter };
