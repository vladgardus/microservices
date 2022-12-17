"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import useRequest from "../../../../hooks/use-request";
type PurchaseButtonProps = {
  ticketId: string;
};
const PurchareButton: NextPage<PurchaseButtonProps> = ({ ticketId }) => {
  const { doRequest, errors } = useRequest({ url: `/api/orders`, method: "post", body: { ticketId } });
  const router = useRouter();
  const onClick = async () => {
    const res = await doRequest();
    if (res.data) {
      router.push(`/orders/${res.data.id}`);
    }
  };
  return (
    <>
      <div
        onClick={onClick}
        className='bg-blue-500 w-28 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-center focus:outline-none focus:shadow-outline'>
        Purchase
      </div>
      {errors}
    </>
  );
};

export default PurchareButton;
