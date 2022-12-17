import express, { NextFunction, Request, Response } from "express";
import { Ticket, TicketMapper } from "../models/ticket";

const router = express.Router();

router.get("/tickets", async (req: Request, res: Response, next: NextFunction) => {
  const tickets = await Ticket.find({ orderId: undefined });
  res.status(200).send(tickets.map((ticket) => TicketMapper.toDTO(ticket, req.user?.id)));
});

export { router as showAllTicketRouter };
