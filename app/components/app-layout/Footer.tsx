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
import dubawaLogo from "@/public/dubawaLogo.png";

export const Footer = () => {
  return (
    <footer className="flex flex-col min-h-[30vh] py-20 bg-white text-gray-800">
      <section className="container flex flex-wrap items-start justify-between px-4 mx-auto text-sm md:flex-nowrap gap-8">
        <div className="mt-2 self-start w-full lg:w-[33%]">
          <Image src={CJIDLogo} alt="TheCJID" width="100" height="100" />
          <Image src={dubawaLogo} alt="TheCJID" width="100" height="100" />
          <p className="mt-2">
            © {new Date().getFullYear()}. Dubawa Audio. CJID. All Rights
            Reserved
          </p>

          <div className="flex items-center mt-2 text-2xl gap-2 md:ga-4">
            <Link
              href="https://web.facebook.com/TheCJID"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaFacebook />
            </Link>
            <Link
              href="https://www.linkedin.com/company/thecjid/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaLinkedin />
            </Link>
            <Link
              href="https://twitter.com/CJIDAfrica"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaTwitter />
            </Link>
            <Link
              href="https://www.instagram.com/thecjid/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <BsInstagram />
            </Link>
            <Link
              href="https://youtube.com/@centreforjournalisminnovat3341"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FaYoutube />
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-[33%]">
          <h5 className="mb-4 text-lg font-semibold">Quick Links</h5>
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
          <h5 className="mb-4 text-lg font-semibold">Company</h5>
          <ul>
            {[
              {
                title: "Privacy Policy",
                link: "https://thecjid.org/privacy-policy/",
              },
              {
                title: "Terms of Service",
                link: "https://thecjid.org/terms-of-service/",
              },
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

        <div className="self-end">
          <button className="fixed bottom-4 right-4">
            <Image src={GoUp} className="w-10 h-10 mx-auto" alt="" />
            <p className="mt-1 font-medium text-gray-600">Scroll Up</p>
          </button>
        </div>
      </section>
    </footer>
  );
};
