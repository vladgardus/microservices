import buildFetch from "../../hooks/use-server-fetch";
import { headers } from "next/headers";
import Link from "next/link";

const LandingPage = async () => {
  const fetch = buildFetch(headers(), "get");
  const tickets = await fetch<Ticket[]>("/api/tickets");
  return (
    <div className='px-4 lg:px-6'>
      <h1>Tickets</h1>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='px-4 py-2'>Title</th>
            <th className='px-4 py-2'>Price</th>
            <th className='px-4 py-2'>Link</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className='border px-4 py-2'>{ticket.title}</td>
              <td className='border px-4 py-2'>{ticket.price}</td>
              <td className='border px-4 py-2'>
                <Link href={`/tickets/${ticket.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LandingPage;
