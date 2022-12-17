import buildFetch from "../../../hooks/use-server-fetch";
import { headers } from "next/headers";
import Link from "next/link";

const MyOrders = async () => {
  const fetch = buildFetch(headers(), "get");
  const orders = await fetch<Order[]>("/api/orders");
  return (
    <div className='px-4 lg:px-6'>
      <h1>Orders</h1>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='px-4 py-2'>Title</th>
            <th className='px-4 py-2'>Price</th>
            <th className='px-4 py-2'>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className='border px-4 py-2'>{order.ticket.title}</td>
              <td className='border px-4 py-2'>{order.ticket.price}</td>
              <td className='border px-4 py-2'>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;
