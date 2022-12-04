"use client";

import { FormEventHandler, useState } from "react";
import useRequest from "../../../hooks/use-request";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({ url: "/api/users/signup", method: "post", body: { email, password } });
  const router = useRouter();
  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    let response = await doRequest();
    if (response?.data) router.push("/");
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className='form-group'>
          <label>Email Address</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' className='form-control' />
        </div>
        {errors}
        <button className='btn btn-primary'>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
