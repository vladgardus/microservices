import { isAuthenticated, validateRequest, NotFoundError, UnauthorizedError, DatabaseConnectionError, Patterns } from "@vgticketingapp/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket, TicketMapper } from "../models/ticket";
import TicketValidators from "../validators/TicketValidator";
import { startSession } from "mongoose";
import { PublishEvent } from "../models/publish-event";

const router = express.Router();

router.put("/tickets/:id", isAuthenticated, TicketValidators.all, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, price } = req.body;
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    next(new NotFoundError());
    return;
  }
  if (ticket.userId != req.user?.id) {
    next(new UnauthorizedError());
    return;
  }
  const SESSION = await startSession();
  try {
    SESSION.startTransaction();
    ticket.set({ title, price });
    await ticket.save();
    const newMessage = PublishEvent.build({ message: JSON.stringify(TicketMapper.toDTO(ticket, req.user?.id)), pattern: Patterns.TicketUpdated });
    await newMessage.save();
    await SESSION.commitTransaction();
    res.send(TicketMapper.toDTO(ticket, req.user.id));
  } catch (err) {
    await SESSION.abortTransaction();
    throw new DatabaseConnectionError();
  } finally {
    SESSION.endSession();
  }
});

export { router as updateTicketRouter };
