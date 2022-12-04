import React, { useEffect, useState } from "react";

interface UseRequestProps {
  url: string;
  method: "get" | "post";
  body?: { [key: string]: string | number };
}

interface ApiErrorResponse extends Error {
  errors: { message: string; field?: string }[];
}
const isApiErrorResponse = (err: any): err is ApiErrorResponse => {
  return !!(err as ApiErrorResponse)?.errors;
};

const useRequest = ({ url, method, body }: UseRequestProps) => {
  const [errors, setErrors] = useState(<></>);
  const doRequest = () =>
    new Promise<{ data?: { [key: string]: string | number }; err?: Error }>(async (resolve, reject) => {
      setErrors(<></>);
      try {
        const requestOptions = {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        };
        const response = await (await fetch(url, requestOptions)).json();
        if (response.errors) throw { errors: response.errors };
        resolve({ data: response });
      } catch (err) {
        if (isApiErrorResponse(err)) {
          setErrors(
            <div className='w-full bg-red-300 rounded-lg shadow md:mt-0 sm:max-w-md p-1'>
              <h4 className='text-red-600 p-1 text-xl font-bold'>Errors...</h4>
              <ul className='my-0'>
                {err.errors.map((err) => (
                  <li key={err.message} className='text-sm p-1 text-red-600'>
                    {err.message}
                  </li>
                ))}
              </ul>
            </div>
          );
          resolve({ err: err });
        } else {
          reject(err);
        }
      }
    });
  return { doRequest, errors };
};

export default useRequest;
