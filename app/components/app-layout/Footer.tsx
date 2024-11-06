import Image from "next/image";
import CJIDLogo from "../../../public/cjid-logo.webp";
import GoUp from "../../../public/go-up.svg";
import { navigationItems } from "./util";
import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="flex flex-col min-h-[30vh] py-20 bg-white text-gray-800">
      <section className="container mx-auto flex flex-wrap px-4 gap-8 justify-between items-start text-sm">
        <div className="self-center w-full lg:w-[33%]">
          <Image src={CJIDLogo} alt="TheCJID" width="100" height="100" />
          <p className="mt-2">
            © {new Date().getFullYear()}. Dubawa Audio. CJID. All Rights
            Reserved
          </p>

          <div className="flex items-center gap-2 md:ga-4 mt-2 text-2xl">
            <FaFacebook />
            <FaLinkedin />
            <FaTwitter />
            <BsInstagram />
            <FaYoutube />
          </div>
        </div>

        <div className="w-full lg:w-[33%]">
          <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
          <ul>
            {navigationItems.map(({ title, link }, idx) => {
              return (
                <li key={idx} className="my-2">
                  <Link href={link}>
                    <p>{title}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="w-full lg:w-[33%]">
          <h5 className="text-lg font-semibold mb-4">Company</h5>
          <ul>
            {[
              { title: "Contact us", link: "#contact" },
              { title: "Privacy Policy", link: "privacy-policy" },
              { title: "Terms of Service", link: "terms-of-service" },
            ].map(({ title, link }, idx) => {
              return (
                <li key={idx} className="my-2">
                  <Link href={link}>
                    <p>{title}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="self-end ">
          <button className="fixed bottom-4 right-4">
            <Image src={GoUp} className="w-10 h-10 mx-auto" alt="" />
            <p className="font-medium mt-1 text-gray-600">Scroll Up</p>
          </button>
        </div>
      </section>
    </footer>
  );
};
