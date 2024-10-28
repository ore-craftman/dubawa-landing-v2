"use client";
import Link from "next/link";
import { navigationItems } from "./util";
import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../public/logo.svg";

const Menu = ({ isScrolled }: { isScrolled: boolean }) => {
  return (
    <div>
      <ul
        className={`flex items-center gap-2 text-sm ${
          isScrolled ? " bg-transparent " : " bg-[#07132b] "
        } rounded-full px-4`}
      >
        {navigationItems.map(({ title, link }, idx) => {
          return (
            <li key={idx} className="p-1">
              <Link href={link}>
                <p className="p-4 hover:text-[#2C7C9D] text-white">{title}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full z-50 fixed top-0 text-white transition-all duration-300 ${
        isScrolled ? "bg-white/10 backdrop-blur-xl shadow-lg" : "bg-transparent"
      }`}
    >
      <section className="flex items-center justify-between container mx-auto py-4">
        <div className="">
          <Link href="/">
            <div className="bg-white text-gray-700 font-bold p-2 rounded-lg">
              <Image src={Logo} alt="" width={30} height={30} />
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-between w-[70%] ">
          <div>
            <Menu isScrolled={isScrolled} />
          </div>
          <div className="flex items-center gap-4">
            <Link href="#">
              <p className="hover:text-[#2C7C9D]">Login</p>
            </Link>
            <Link href="#">
              <p className="bg-white hover:bg-slate-200 text-[#2C7C9D] font-medium px-6 py-3 rounded-xl">
                Get Started
              </p>
            </Link>
          </div>
        </div>
      </section>
    </header>
  );
};
