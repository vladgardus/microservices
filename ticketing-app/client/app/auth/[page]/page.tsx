"use client";

import { FormEventHandler, useEffect, useState } from "react";
import useRequest from "../../../hooks/use-request";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import Link from "next/link";

interface AuthenticationProps {
  children: JSX.Element;
  params: { page: string };
}

const Authentication: NextPage<AuthenticationProps> = ({ params }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { doRequest, errors } = useRequest({ url: `/api/users/${params.page}`, method: "post", body: { email, password } });
  useEffect(() => {
    if (params.page === "signout") {
      doRequest().then(() => {
        router.push("/auth/signin");
        router.refresh();
      });
    }
  }, []);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    let response = await doRequest();
    if (response?.data) {
      router.push("/");
      router.refresh();
    }
  };
  return (
    // <div>
    //   <form onSubmit={onSubmit}>
    //     <h1>Sign Up</h1>
    //     <div className='form-group'>
    //       <label>Email Address</label>
    //       <input value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' />
    //     </div>
    //     <div className='form-group'>
    //       <label>Password</label>
    //       <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' className='form-control' />
    //     </div>
    //     {errors}
    //     <button className='btn btn-primary'>Sign Up</button>
    //   </form>
    // </div>
    <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
      <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
          <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>{params.page === "signup" ? "Sign Up" : "Sign In"}</h1>
          <form className='space-y-4 md:space-y-6' onSubmit={onSubmit}>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Your email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                name='email'
                id='email'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='test@test.com'
                required
              />
            </div>
            <div>
              <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                name='password'
                id='password'
                placeholder='••••••••'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                required
              />
            </div>
            {errors}
            <button
              type='submit'
              className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'>
              {params.page === "signup" ? "Sign Up" : "Sign In"}
            </button>
            <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
              {params.page === "signup" ? (
                <>
                  Already have an account? &nbsp;
                  <Link href='/auth/signin' className='font-medium text-primary-600 hover:underline dark:text-primary-500'>
                    Sign In
                  </Link>
                </>
              ) : (
                <>
                  Don’t have an account yet? &nbsp;
                  <Link href='/auth/signup' className='font-medium text-primary-600 hover:underline dark:text-primary-500'>
                    Sign Up
                  </Link>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
