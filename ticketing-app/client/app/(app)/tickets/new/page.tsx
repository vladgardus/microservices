"use client";

import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";
import useRequest from "../../../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const router = useRouter();
  const { doRequest, errors } = useRequest({ url: `/api/tickets`, method: "post", body: { title, price } });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    let response = await doRequest();
    if (response?.data) {
        router.push("/");
    }
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={onSubmit} className='space-y-4 md:space-y-6 flex flex-col items-start justify-start mx-auto md:h-screen lg:py-0'>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='title'>
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='title'
            type='text'
            placeholder='Title'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='price'>
            Price
          </label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='price'
            type='number'
            placeholder='Price'
          />
        </div>
        <div className='flex items-center justify-end'>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='submit'>
            Submit
          </button>
        </div>
        {errors}
      </form>
    </div>
  );
};

export default NewTicket;
