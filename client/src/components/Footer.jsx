import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

function Footer() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  return (
    <>
      <footer className="relative left-0 bottom-0 h-[13vh] sm:h-[10vh] py-5 flex flex-col sm:flex-row items-center justify-between text-white bg-gray-800 sm:px-20">
        <section className="text-lg text-red">
          Copyright {year} | All rights reserved
        </section>
        <section className="flex items-center justify-center gap-5 text-2xl text-white">
          <a className="hover:text-green-500 cursor-pointer transition-all ease-in-out duration-300">
            <BsFacebook />
          </a>
          <a className="hover:text-green-500 cursor-pointer transition-all ease-in-out duration-300">
            <BsInstagram />
          </a>
          <a
            href="https://www.linkedin.com/in/mohd-shoaib-ansari-2a0b16230/"
            className="hover:text-green-500 cursor-pointer transition-all ease-in-out duration-300"
          >
            <BsLinkedin />
          </a>
          <a className="hover:text-green-500 cursor-pointer transition-all ease-in-out duration-300">
            <BsTwitter />
          </a>
        </section>
      </footer>
    </>
  );
}

export default Footer;
