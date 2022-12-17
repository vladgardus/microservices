import { headers } from "next/headers";
import buildFetch from "../../../../hooks/use-server-fetch";
import PurchaseButton from "./PurchaseButton";

type TicketProps = {
  children: JSX.Element;
  params: { ticketId: string };
};

const Ticket = async ({ params }: TicketProps) => {
  const fetch = buildFetch(headers(), "get");
  const ticket = await fetch<Ticket | undefined>(`/api/tickets/${params.ticketId}`);
  return (
    <div className='max-w-sm rounded overflow-hidden shadow-lg'>
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>Title</div>
        <p className='text-gray-700 text-base'>{ticket?.title}</p>
      </div>
      <div className='px-6 py-4'>
        <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'>Price: {ticket?.price}</span>
        <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'>Version: {ticket?.version}</span>
        <PurchaseButton ticketId={ticket?.id ?? ""} />
      </div>
    </div>
  );
};

export default Ticket;
