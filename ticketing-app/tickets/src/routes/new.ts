import { isAuthenticated, validateRequest } from "@vgticketingapp/common";
import express, { Request, Response } from "express";
import { Ticket, TicketMapper } from "../models/ticket";
import TicketValidators from "../validators/TicketValidator";

const router = express.Router();

router.post("/tickets", isAuthenticated, TicketValidators.all, validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const ticket = Ticket.build({ title, price, userId: req.user!.id });
  await ticket.save();
  res.status(201).send(TicketMapper.toDTO(ticket, req.user?.id));
});

export { router as createTicketRouter };
