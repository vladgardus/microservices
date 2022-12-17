import { headers } from "next/headers";
import buildFetch from "../../../../hooks/use-server-fetch";
import PayButton from "./PayButton";
import TimerComponent from "./TimerComponent";

type OrderProps = {
  children: JSX.Element;
  params: { orderId: string };
};

const Ticket = async ({ params }: OrderProps) => {
  const fetch = buildFetch(headers(), "get");
  const order = await fetch<Order | undefined>(`/api/orders/${params.orderId}`);
  return (
    <div className='max-w-sm rounded overflow-hidden shadow-lg'>
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>Title</div>
        <p className='text-gray-700 text-base'>{order?.ticket.title}</p>
      </div>
      <div className='px-6 py-4'>
        <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'>Price: {order?.ticket?.price}</span>
        <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'>Version: {order?.ticket?.version}</span>
        <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'>Status: {order?.status}</span>
      </div>
      {order?.status != "complete" ? (
        <div className='px-6 py-4'>
          <TimerComponent date={order?.expiresAt ?? new Date().toISOString()} />
          <PayButton orderId={order?.id ?? ""} amount={(order?.ticket?.price ?? 0) * 100} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Ticket;
