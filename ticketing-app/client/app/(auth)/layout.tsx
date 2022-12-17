import "./globals.css";
import Link from "next/link";
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>

      <head />
      <body>
        <header>
          <nav className='bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800'>
            <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl'>
              <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>Ticketing App</span>
              <div className='flex items-center lg:order-2'>
                <Link
                  href='/auth/signup'
                  className='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'>
                  Sign Up
                </Link>
                <Link
                  href='/auth/signin'
                  className='text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800'>
                  Sign In
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
