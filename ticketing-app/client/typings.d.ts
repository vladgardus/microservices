type Ticket = {
  id: string;
  title: string;
  price: number;
  userId?: string;
  version: number;
  orderId: string;
};

type Order = {
  id: string;
  userId: string;
  status: string;
  expiresAt: string;
  ticket: TicketDTO;
  version: number;
};

type TicketDTO = {
  id: string;
  title: string;
  price: number;
  version: number;
};
