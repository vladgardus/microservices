"use client";

import { NextPage } from "next";
import useRequest from "../../../../hooks/use-request";
import StripeCheckout from "react-stripe-checkout";
import useAuth from "../../../../hooks/use-client-auth";
import { useRouter } from "next/navigation";
type PurchaseButtonProps = {
  orderId: string;
  amount: number;
};
const PurchareButton: NextPage<PurchaseButtonProps> = ({ orderId, amount }) => {
  const { doRequest, errors } = useRequest({ url: `/api/payments`, method: "post", body: { orderId } });
  const userAuth = useAuth();
  const router = useRouter();
  // defaults for modal: card number: 4242424242424242; cvc: any; date: any future date
  return (
    <>
      {/* <div
        // onClick={() => doRequest()}
        className='bg-blue-500 hover:bg-blue-700 w-24 text-white font-bold py-2 px-4 rounded-full text-center focus:outline-none focus:shadow-outline'>
        Pay */}
      <StripeCheckout
        token={async (token) => {
          const res = await doRequest({ token: token.id, orderId });
          if (res.data) {
            router.push("/orders");
          }
        }}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY!}
        amount={amount}
        email={userAuth?.email}
      />
      {/* </div> */}
      {errors}
    </>
  );
};

export default PurchareButton;
