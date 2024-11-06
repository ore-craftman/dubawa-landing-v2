"use client";
import Link from "next/link";
import { navigationItems } from "./util";
import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../public/logo.svg";
import { TbMenu2 } from "react-icons/tb";
import { motion } from "framer-motion";

import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
  DrawerTrigger,
} from "@/components/ui/drawer";

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

const MobileNav = () => {
  return (
    <DrawerRoot>
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <section className="absolute right-4 top-4 lg:hidden">
          <button>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white text-black w-12 h-12 rounded-full flex justify-center items-center"
            >
              <TbMenu2 className="text-3xl" />
            </motion.div>
          </button>
        </section>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerBody py={14}>
          <ul>
            {navigationItems.map(({ title, link }, idx) => {
              return (
                <li key={idx} className="p-1">
                  <Link href={link}>
                    <p className="p-4 hover:text-[#2C7C9D] text-white">
                      {title}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="gap-8 mt-4 flex flex-col ml-5">
            <Link href="#">
              <p className="hover:text-[#2C7C9D]">Login</p>
            </Link>
            <Link href="#">
              <p className="bg-white hover:bg-slate-200 text-[#2C7C9D] font-medium text-center px-6 py-3 rounded-xl">
                Get Started
              </p>
            </Link>
          </div>
        </DrawerBody>

        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
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
      className={`w-full z-50 fixed top-0 px-4 text-white transition-all duration-300 ${
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
          <div className="hidden lg:block">
            <Menu isScrolled={isScrolled} />
          </div>
          <div className="items-center gap-4 hidden lg:flex">
            <Link href="#">
              <p className="hover:text-[#2C7C9D]">Login</p>
            </Link>
            <Link href="#">
              <p className="bg-white hover:bg-slate-200 text-[#2C7C9D] font-medium px-6 py-3 rounded-xl">
                Get Started
              </p>
            </Link>
          </div>

          <MobileNav />
        </div>
      </section>
    </header>
  );
};
