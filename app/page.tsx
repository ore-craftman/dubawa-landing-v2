"use client";
import Link from "next/link";
import { AppLayout } from "./components/app-layout";
import { FaPlay } from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { IoMicSharp } from "react-icons/io5";
import TranscriptionIcon from "../public/trans-icon.svg";
import ClaimIcon from "../public/claim.svg";
import RadioIcon from "../public/radio.svg";
import rmImage from "../public/radio-monitoring.svg";
import Transc from "../public/transcription.png";
import ClaimExtr from "../public/claims.svg";

// import * as motion from "framer-motion/client";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, Variants } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const [currentTab, setCurrentTab] = useState(0);
  const [visibleTab, setVisibleTab] = useState(0);

  const ref = useRef(null);
  // const { scrollYProgress } = useScroll({ target: ref });

  const sectionVariants: Variants = {
    offscreen: {
      y: 300,
    },
    onscreen: {
      y: 50,
      rotate: -10,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  const howItWorks = [
    {
      imgSource: rmImage,
      title: "Radio Monitoring",
      data: [
        {
          title: "Search for Keywords Across Radio Transcriptions",
          desc: "Input keywords related to your topic of interest and search through our database of transcribed radio shows.",
        },
        {
          title: "View Transcription Results",
          desc: "The output will display all transcriptions where your keywords were mentioned, labelled with the radio show name, date, and the audio recording for easy reference.",
        },
        {
          title: "Set Up Keyword Alerts",
          desc: "Set up notifications to alert you whenever your specified keyword appears in any future transcriptions.",
        },
      ],
    },
    {
      imgSource: Transc,
      title: "Transcription",
      data: [
        {
          title: "Upload Audio Files",
          desc: "Upload your radio shows, podcasts, or audio files directly to the platform. Supported languages include Nigerian English, Ghanaian English, and Nigerian Pidgin.",
        },
        {
          title: "Automatic Transcription",
          desc: "The platform will automatically convert your audio into text.",
        },
      ],
    },
    {
      imgSource: ClaimExtr,
      title: "claims",
      data: [
        {
          title: "View Flagged Claims",
          desc: "Browse the platform for claims that have been automatically flagged by the AI as potentially misleading or false. The system scans all transcriptions and highlights claims that may need further fact-checking.",
        },
        {
          title: "Review the Context",
          desc: "For each flagged claim, you can review the full context of the statement, including the transcription, the radio show’s name, the audio recording and the date the claim was made.",
        },
      ],
    },
  ];

  // const radioMonitoring = [
  //   {
  //     title: "Search for Keywords Across Radio Transcriptions",
  //     desc: "Input keywords related to your topic of interest and search through our database of transcribed radio shows.",
  //   },
  //   {
  //     title: "View Transcription Results",
  //     desc: "The output will display all transcriptions where your keywords were mentioned, labelled with the radio show name, date, and the audio recording for easy reference.",
  //   },
  //   {
  //     title: "Set Up Keyword Alerts",
  //     desc: "Set up notifications to alert you whenever your specified keyword appears in any future transcriptions.",
  //   },
  // ];

  // const transcription = [
  //   {
  //     title: "Upload Audio Files",
  //     desc: "Upload your radio shows, podcasts, or audio files directly to the platform. Supported languages include Nigerian English, Ghanaian English, and Nigerian Pidgin.",
  //   },
  //   {
  //     title: "Automatic Transcription",
  //     desc: "The platform will automatically convert your audio into text.",
  //   },
  // ];

  // const claims = [
  //   {
  //     title: "View Flagged Claims",
  //     desc: "Browse the platform for claims that have been automatically flagged by the AI as potentially misleading or false. The system scans all transcriptions and highlights claims that may need further fact-checking.",
  //   },
  //   {
  //     title: "Review the Context",
  //     desc: "For each flagged claim, you can review the full context of the statement, including the transcription, the radio show’s name, the audio recording and the date the claim was made.",
  //   },
  // ];
  const faq = [
    {
      title: "What is the Dubawa Audio Platform?",
      desc: "The platform uses advanced AI and machine learning models to transcribe spoken content in audio recordings. It then employs claim detection algorithms to identify statements that may require fact-checking. These claims are presented to human fact-checkers for in-depth verification.",
    },
    {
      title: "What is the Dubawa Audio Platform?",
      desc: "The platform uses advanced AI and machine learning models to transcribe spoken content in audio recordings. It then employs claim detection algorithms to identify statements that may require fact-checking. These claims are presented to human fact-checkers for in-depth verification.",
    },
    {
      title: "What is the Dubawa Audio Platform?",
      desc: "The platform uses advanced AI and machine learning models to transcribe spoken content in audio recordings. It then employs claim detection algorithms to identify statements that may require fact-checking. These claims are presented to human fact-checkers for in-depth verification.",
    },
    {
      title: "What is the Dubawa Audio Platform?",
      desc: "The platform uses advanced AI and machine learning models to transcribe spoken content in audio recordings. It then employs claim detection algorithms to identify statements that may require fact-checking. These claims are presented to human fact-checkers for in-depth verification.",
    },
    {
      title: "What is the Dubawa Audio Platform?",
      desc: "The platform uses advanced AI and machine learning models to transcribe spoken content in audio recordings. It then employs claim detection algorithms to identify statements that may require fact-checking. These claims are presented to human fact-checkers for in-depth verification.",
    },
  ];

  const toggleAccordion = (idx: number) => {
    setVisibleTab(idx);
  };
  return (
    <AppLayout>
      <div className=" bg-[#131E36]">
        <motion.div
          variants={sectionVariants}
          ref={ref}
          className="px-2 text-white h-screen bg-[url('../public/hero-section.svg')] bg-cover bg-no-repeat flex items-center justify-center"
        >
          <div className="max-w-6xl ">
            <h2 className="text-3xl md:text-5xl lg:text-8xl text-center font-bold">
              Unlock the Power of Audio Content
            </h2>
            <p className="text-xl font-light max-w-3xl mx-auto mt-6 mb-10  text-center">
              Transcribe, analyze, and extract claims from any audio
              content—whether it&apos;s radio, podcasts, YouTube videos, or
              interviews. The Dubawa Audio Platform brings you closer to the
              insights you need, across African languages.
            </p>

            <div className="flex items-center gap-4 justify-center mt-6">
              <Link href="#">
                <p className="bg-white hover:bg-slate-200 text-[#2C7C9D] font-medium px-6 py-3 rounded-xl">
                  Get Started
                </p>
              </Link>

              <Link href="#">
                <div className="hover:text-[#2C7C9D] flex items-center gap-3">
                  <FaPlay />
                  <p className="font-medium">Watch Demo</p>
                </div>
              </Link>
            </div>

            <section className="flex text-white text-center items-center justify-center mt-14 gap-6">
              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -110 }}
                  animate={{ opacity: 1, x: -10 }}
                  transition={{ duration: 1 }}
                >
                  <p className="text-xs md:text-[14px]">
                    #Empower media Accountability
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -110 }}
                  animate={{ opacity: 1, x: -10 }}
                  transition={{ duration: 1.1 }}
                >
                  <p className="text-xs md:text-[14px]">
                    #Expand Linguistic Reach
                  </p>
                </motion.div>
              </div>
              <div className="text-[4rem] border border-white p-8 rounded-full ">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                >
                  <IoMicSharp />
                </motion.div>
              </div>

              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 10 }}
                  transition={{ duration: 1 }}
                >
                  <p className="text-xs md:text-[14px]">
                    #Empower media Accountability
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 10 }}
                  transition={{ duration: 1.1 }}
                >
                  <p className="text-xs md:text-[14px]">
                    #Expand Linguistic Reach
                  </p>
                </motion.div>
              </div>
            </section>
          </div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          ref={ref}
          className="py-20 text-slate-900 bg-[#86BEF7] min-h-[60vh] flex flex-col justify-center"
        >
          <div className="flex flex-wrap gap-4 items-center container mx-auto px-2">
            <div className="w-full lg:w-[48%]">
              <h3 className="text-2xl md:text-3xl lg:text-6xl  font-bold">
                Why Dubawa <br />
                Audio Platform?
              </h3>
              <p className="text-xl font-light max-w-2xl mt-6">
                Save hours of manual transcription and analysis with our
                advanced AI-driven platform. From transcribing to extracting
                insights, we streamline your workflow, empowering you to focus
                on what matters most.
              </p>
            </div>
            <div className="w-full lg:w-[48%]">
              <div className="flex gap-4 lg:gap-8">
                <div className="text-center bg-slate-200 p-4 md:p-8 rounded-3xl hover:shadow-xl">
                  <Image
                    src={TranscriptionIcon}
                    alt="transcription"
                    className="mx-auto mb-2"
                  />
                  <h4 className="font-semibold text-lg my-2">
                    Transcription Made Easy
                  </h4>
                  <p className="text-sm font-medium text-gray-600">
                    Upload and transcribe audio from diverse sources like radio,
                    podcasts, YouTube videos, and interviews. Our platform
                    supports local dialects in Nigerian English, Ghanaian
                    English, and Pidgin, ensuring every word counts.
                  </p>
                </div>

                <div className="text-center bg-slate-200 p-4 md:p-8 rounded-3xl hover:shadow-xl">
                  <Image
                    src={ClaimIcon}
                    alt="claim extraction"
                    className="mx-auto mb-2"
                  />
                  <h4 className="font-semibold text-lg my-2">
                    Automated Claim Detection
                  </h4>
                  <p className="text-sm font-medium text-gray-600">
                    Identify and extract potentially false or misleading claims
                    automatically. Our tools equip fact-checkers, journalists,
                    and researchers to stay ahead in the fight against
                    misinformation.
                  </p>
                </div>
              </div>

              <div className="text-center bg-slate-200 p-4 md:px-8 md:py-10 rounded-3xl hover:shadow-xl mt-4 lg:mt-8 ">
                <div className="max-w-md mx-auto">
                  <Image
                    src={RadioIcon}
                    alt="claim extraction"
                    className="mx-auto mb-2"
                  />
                  <h4 className="font-semibold text-lg my-2">
                    Radio Monitoring with Alerts
                  </h4>
                  <p className="text-sm font-medium text-gray-600">
                    Stay informed on the latest discussions across radio
                    broadcasts. Search for specific keywords within transcribed
                    sessions and set up custom keyword alerts. Get notified
                    instantly when relevant terms appear, keeping you in the
                    loop and ready to act.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <section className="text-slate-900 bg-gradient-to-b from-[#B3BCFF] to-[#77B1ED] px-2 py-20 z-50">
          <h3 className="text-2xl  md:text-3xl lg:text-6xl text-center font-bold">
            How It Works
          </h3>

          <div className="h-full  ">
            <div className="flex flex-wrap w-full items-center gap-2 md:gap-4 justify-center  font-medium my-4 lg:gap-6 ">
              {howItWorks.map((data, idx) => {
                return (
                  <button key={idx} onClick={() => setCurrentTab(idx)}>
                    <p
                      className={`text-xs md:text-md lg:text-[15px] rounded-full py-2 px-4  ${
                        currentTab == idx
                          ? " bg-slate-300 border "
                          : " text-gray-600 "
                      }`}
                    >
                      {data.title}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="">
              {howItWorks.map((data, idx) => {
                return (
                  <div
                    className={`container mx-auto gap-4 lg:gap-8 justify-between items-center pt-4 ${
                      currentTab == idx
                        ? " flex flex-wrap md:flex-nowrap "
                        : " hidden "
                    }`}
                    key={idx}
                  >
                    <div className="w-full md:w-[55%] ">
                      {data.data.map((data, idx) => {
                        return (
                          <div
                            key={idx}
                            className="flex gap-2 md:gap-4 lg:gap-10 my-4"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <h5>0{idx + 1}</h5>
                              <div className="w-1 h-10 bg-blue-950" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-xl mb-2">
                                {data.title}
                              </h5>
                              <p>{data.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="w-full md:w-[45%] ">
                      <Image src={data.imgSource} alt="" className="w-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="py-20 px-2 text-white bg-[#131E36] min-h-[60vh] flex flex-col justify-center">
          <h3 className="text-xl  md:text-3xl lg:text-4xl text-center font-bold">
            Frequently Asked Questions
          </h3>

          <p className="text-xl font-light text-center mt-6 mb-10">
            Answers to any questions you might have, have more? Contact us
          </p>

          <div className="max-w-3xl mx-auto">
            {faq.map((data, idx) => {
              return (
                <div className="border-b border-slate-200" key={idx}>
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex justify-between items-center py-5 text-white"
                  >
                    <h5
                      className={`font-semibold text-lg ${
                        visibleTab === idx ? " text-[#2C7C9D] " : " text-white "
                      }`}
                    >
                      {data.title}
                    </h5>
                    <span className="text-white transition-transform duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`${
                      visibleTab === idx ? "max-h-[8em] py-2 " : " max-h-0 "
                    } overflow-hidden transition-all duration-300 ease-in-out`}
                  >
                    <div className="pb-5 text-lg">{data.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full lg:w-[400px]  mx-auto py-20 ">
            <h3 className="text-xl  md:text-3xl lg:text-4xl text-center font-bold mt-2">
              Contact Us
            </h3>

            <p className="text-xl font-light text-center mt-2 mb-4">
              Get in touch, let&apos;s help.
            </p>

            <form className="py-4 flex flex-col gap-4 ">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="rounded-md bg-slate-200 w-full p-4 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="rounded-md bg-slate-200 w-full p-4 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea className="rounded-md bg-slate-200 w-full text-slate-800 p-2 min-h-[120px]" />
              </div>

              <button
                className="font-semibold bg-[#2C7C9D] p-4 mt-2 rounded-md hover:bg-[#2C7C9D]/70"
                role="submit"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col px-2 min-h-[50vh] items-center justify-center bg-[url('../public/pre-footer.svg')] bg-cover bg-no-repeat">
          <div className="max-w-lg">
            <h3 className="text-xl  md:text-3xl lg:text-4xl text-center font-bold mt-2">
              Get Started Now
            </h3>

            <p className="text-xl font-light text-center mt-2 mb-4">
              Effortless Radio Monitoring, Transcription and Claim Extraction at
              Your Fingertips.
            </p>

            <button className="bg-black hover:bg-black/80 cursor-pointer text-[#fff] font-medium px-6 py-3 rounded-xl mx-auto block">
              <Link href="#">Get Started</Link>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Home;
