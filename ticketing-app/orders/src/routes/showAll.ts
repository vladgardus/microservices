import { isAuthenticated } from "@vgticketingapp/common";
import express, { NextFunction, Request, Response } from "express";
import { Order, OrderMapper } from "../models/order";

const router = express.Router();

router.get("/orders", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  const orders = await Order.find({ userId: req.user?.id }).populate("ticket");
  res.status(200).send(orders.map((order) => OrderMapper.toDTO(order, req.user?.id)));
});

export { router as showAllOrderRouter };
