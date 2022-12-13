import { BadRequestError, DatabaseConnectionError, isAuthenticated, NotFoundError, OrderCreatedEvent, OrderStatus, Patterns, validateRequest } from "@vgticketingapp/common";
import express, { NextFunction, Request, Response } from "express";
import { startSession } from "mongoose";
import { PublishEvent } from "../models/publish-event";
import { Order, OrderMapper } from "../models/order";
import OrderValidators from "../validators/OrderValidator";
import { Ticket, TicketMapper } from "../models/ticket";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post("/orders", isAuthenticated, OrderValidators.new, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  const { ticketId } = req.body;
  const SESSION = await startSession();
  try {
    SESSION.startTransaction();
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      next(new BadRequestError("Ticket does not exist!"));
      return;
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      next(new BadRequestError("Ticket is already reserved."));
      return;
    }
    const expirationDate = new Date(new Date().setSeconds(new Date().getSeconds() + EXPIRATION_WINDOW_SECONDS));
    const order = Order.build({ ticket: ticket, expiresAt: expirationDate, status: OrderStatus.Created, userId: req.user!.id });
    await order.save();
    const message: OrderCreatedEvent["data"] = OrderMapper.toDTO(order, req.user!.id);
    message.ticket = TicketMapper.toDTO(ticket);
    const newMessage = PublishEvent.build({ message: JSON.stringify(message), pattern: Patterns.OrderCreated });
    await newMessage.save();
    res.status(201).send(OrderMapper.toDTO(order, req.user?.id));
  } catch (err) {
    console.error(err);
    await SESSION.abortTransaction();
    throw new DatabaseConnectionError();
  } finally {
    SESSION.endSession();
  }
});

export { router as createOrderRouter };
