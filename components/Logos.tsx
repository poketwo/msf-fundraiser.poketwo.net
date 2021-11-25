import Image from "next/image";
import { HiPlus } from "react-icons/hi";

const Logos = () => (
  <div className="flex items-center -mb-6 gap-4 md:gap-12">
    <a
      href="https://poketwo.net/"
      className="filter drop-shadow-sm transform transition-transform hover:-translate-y-1"
    >
      <Image src="/logo.png" height={200} width={200} />
    </a>
    <HiPlus className="text-4xl text-gray-500" />
    <a
      href="https://www.msf.org/"
      className="filter drop-shadow-md transform transition-transform hover:-translate-y-1"
    >
      <Image src="/msf_logo.svg" height={200} width={200} />
    </a>
  </div>
);

export default Logos;
