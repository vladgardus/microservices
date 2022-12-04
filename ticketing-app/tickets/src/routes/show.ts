import { NotFoundError } from "@vgticketingapp/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket, TicketMapper } from "../models/ticket";

const router = express.Router();

router.get("/tickets/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    next(new NotFoundError());
    return;
  }
  res.status(200).send(TicketMapper.toDTO(ticket, req.user?.id));
});

export { router as showTicketRouter };
