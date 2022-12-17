import "./globals.css";
import Link from "next/link";
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // const fetch = buildFetch(headers());
  // let user = await fetch("/api/users/currentuser").then((res) => res.json());

  return (
    <html lang='en'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className='mx-auto max-w-screen-xl'>
        <header>
          <nav className='bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800'>
            <div className='flex flex-wrap justify-between items-center'>
              <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>Ticketing App</span>
              <div className='flex items-center lg:order-2'>
                <Link
                  href='/tickets/new'
                  className='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'>
                  Sell Tickets
                </Link>
                <Link
                  href='/orders'
                  className='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'>
                  My orders
                </Link>
                <Link
                  href='/auth/signout'
                  className='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'>
                  Sign Out
                </Link>
              </div>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
