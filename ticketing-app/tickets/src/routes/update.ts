import { isAuthenticated, validateRequest, NotFoundError, UnauthorizedError } from "@vgticketingapp/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket, TicketMapper } from "../models/ticket";
import TicketValidators from "../validators/TicketValidator";

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
  ticket.set({ title, price });
  ticket.save();
  res.send(TicketMapper.toDTO(ticket, req.user.id));
});

export { router as updateTicketRouter };
