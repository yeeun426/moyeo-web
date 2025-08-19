"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const Home = () => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const { formattedDate, currentDate } = useMemo(() => {
    const today = new Date();
    const formatted = `Today, ${today.getDate()} ${monthNames[today.getMonth()]}`;
    return {
      formattedDate: formatted,
      currentDate: today.getDate(),
    };
  }, [monthNames]);

  return (
    <main className="bg-white min-h-screen">
      <div className="w-full h-[200px] relative">
        <Image
          src="/images/header_home.png"
          alt="header"
          fill
          className="object-cover rounded-b-3xl"
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-white flex items-center justify-center">
            <Image
              src="/images/cat.png"
              alt="cat"
              width={70}
              height={70}
              className="rounded-full"
            />
          </div>
          <p className="mt-2 text-lg font-medium text-black">예은</p>
        </div>
      </div>

      <section className="flex flex-col items-center px-6 mt-6">
        <div className="text-center">
          <p className="text-gray-500 text-sm">{formattedDate}</p>
          <h2 className="text-2xl font-bold font-paperlogy mt-1">
            오늘의 챌린지
          </h2>
        </div>

        <div className="flex justify-evenly w-full my-6 text-sm font-bold">
          {[...Array(7)].map((_, idx) => {
            const offset = idx - 3;
            const date = currentDate + offset;
            return (
              <div
                key={idx}
                className={
                  offset === 0
                    ? "bg-orange-500 text-white px-2 py-1 rounded-full"
                    : "opacity-40"
                }
              >
                {offset === 0 ? formattedDate : date}
              </div>
            );
          })}
        </div>

        <div className="bg-orange-500 text-white rounded-full px-4 py-2 text-base font-medium mb-1">
          6:00 - 7:00 미라클 모닝
        </div>
        <p className="text-gray-500 text-base">9:00 - 16:00 모각코</p>
        <p className="text-gray-500 text-base mb-6">20:00 - 21:00 : 알고리즘</p>

        <h3 className="text-lg font-bold  w-full text-left">
          당신의 챌린지를 골라보세요 !
        </h3>
        <div className="flex gap-4 mt-4 mb-6">
          {[1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className="bg-green-400 rounded-2xl h-32 w-28 p-4 text-white text-sm flex flex-col justify-between"
            >
              <span>모각코</span>
              <span>₩ 20000</span>
            </div>
          ))}
        </div>

        <div className="bg-purple-400 rounded-2xl px-6 py-4 flex items-center gap-4 text-white w-full">
          <p className="text-lg">맘에 드는 챌린지가 없나요 ?</p>
          <Link href="/create-challenge">
            <button className="bg-white text-purple-400 text-xs font-semibold px-3 py-1 rounded-md">
              Make Now
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
