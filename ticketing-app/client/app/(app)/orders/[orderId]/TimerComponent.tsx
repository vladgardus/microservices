"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";

type TimerComponentProps = {
  date: string;
};

const TimerComponent: NextPage<TimerComponentProps> = ({ date }) => {
  const [timer, setTimer] = useState((new Date(date).getTime() - new Date().getTime()) / 1000);
  useEffect(() => {
    const timeoutRef = setTimeout(() => setTimer((new Date(date).getTime() - new Date().getTime()) / 1000), 1000);
    return () => {
      clearTimeout(timeoutRef);
    };
  });
  return <span className='inline-block px-3 py-1 text-sm font-semibold text-gray-700 mr-2'>{timer > 0 ? `You have: ${timer.toFixed(0)} seconds left for you to pay` : "Timer expired"}</span>;
};

export default TimerComponent;
