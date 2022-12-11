import { DatabaseConnectionError, isAuthenticated, Patterns, validateRequest } from "@vgticketingapp/common";
import express, { Request, Response } from "express";
import { startSession } from "mongoose";
import { PublishEvent } from "../models/publish-event";
import { Ticket, TicketMapper } from "../models/ticket";
import TicketValidators from "../validators/TicketValidator";

const router = express.Router();

router.post("/tickets", isAuthenticated, TicketValidators.all, validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const SESSION = await startSession();
  try {
    SESSION.startTransaction();
    const ticket = Ticket.build({ title, price, userId: req.user!.id });
    await ticket.save();
    const newMessage = PublishEvent.build({ message: JSON.stringify(TicketMapper.toDTO(ticket, req.user?.id)), pattern: Patterns.TicketCreated });
    await newMessage.save();
    res.status(201).send(TicketMapper.toDTO(ticket, req.user?.id));
  } catch (err) {
    await SESSION.abortTransaction();
    throw new DatabaseConnectionError();
  } finally {
    SESSION.endSession();
  }
});

export { router as createTicketRouter };
