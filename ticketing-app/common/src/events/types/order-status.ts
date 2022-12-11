export enum OrderStatus {
  // order is created but ticket has not been reserved
  Created = "created",
  // order has been canceled or ticket is already reserved or order expires before payment
  Canceled = "canceled",
  // order has successfully reserved a ticket
  AwaitingPayment = "awaiting-payment",
  // order has reserved ticket and provided payment
  Complete = "complete",
}
