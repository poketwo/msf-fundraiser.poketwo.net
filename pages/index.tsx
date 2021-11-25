import clsx from "clsx";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { FormEventHandler, PropsWithChildren, useRef } from "react";
import { HiCheckCircle, HiChevronUp, HiPlus } from "react-icons/hi";
import { fetchValue } from "../lib/db";

const format = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const Logos = () => (
  <div className="flex items-center -mb-8 gap-4 md:gap-12">
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

const Text = () => (
  <div className="text-center">
    <h1 className="text-3xl md:text-5xl mb-4 font-extrabold">
      Help save lives around the world
    </h1>

    <p className="text-lg md:text-2xl">
      For Thanksgiving, help fund medical relief to save lives and ease
      suffering around the world, and you'll receive in-game rewards while
      you're at it. 100% of your donation will go to{" "}
      <a href="https://www.msf.org/" className="text-blue-800 hover:underline">
        Médecins Sans Frontières / Doctors Without Borders
      </a>
      , an international humanitarian organization that provides millions of
      consultations, surgeries, treatments and vaccinations across over 70
      countries every year.
    </p>
  </div>
);

type ProgressBarItemProps = PropsWithChildren<{
  currentValue: number;
  value: number;
}>;

const ProgressBarItem = ({
  value,
  currentValue,
  children,
}: ProgressBarItemProps) => (
  <div className="flex-1 md:ml-4 flex flex-col gap-1">
    {currentValue >= value ? (
      <HiCheckCircle className="hidden md:block text-xl ml-auto text-green-600 transform translate-x-1/3" />
    ) : (
      <HiChevronUp className="hidden md:block text-xl ml-auto transform translate-x-1/3" />
    )}

    <h2
      className={clsx(
        "text-2xl font-bold",
        currentValue >= value && "text-green-600"
      )}
    >
      {format.format(value)}
    </h2>

    <p className={currentValue >= value ? "text-green-600" : ""}>{children}</p>
  </div>
);

type ProgressBarProps = {
  currentValue: number;
};

const ProgressBar = ({ currentValue }: ProgressBarProps) => {
  const percentage = (Math.min(currentValue, 10000) / 10000) * 100;

  return (
    <div className="relative flex flex-col w-full">
      <div className="text-4xl text-center mb-8">
        <span className="text-5xl font-black">
          {format.format(currentValue)}
        </span>{" "}
        / 10,000
      </div>

      <div className="rounded-lg mb-8 md:mb-3 overflow-hidden h-8 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-yellow-500 to-red-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row text-left md:text-right">
        <ProgressBarItem value={2500} currentValue={currentValue}>
          All donors receive a profile badge to showcase their generous
          contribution
        </ProgressBarItem>
        <ProgressBarItem value={5000} currentValue={currentValue}>
          All donors receive 20,000 Pokécoins. 5&times;{" "}
          <b>Shiny United Pikachu</b> raffled out
        </ProgressBarItem>
        <ProgressBarItem value={7500} currentValue={currentValue}>
          All donors receive 50,000 Pokécoins as a reward for their charitable
          donation
        </ProgressBarItem>
        <ProgressBarItem value={10000} currentValue={currentValue}>
          All donors receive 1,000 shards. 10&times; additional{" "}
          <b>Shiny United Pikachu</b> raffled out
        </ProgressBarItem>
      </div>
    </div>
  );
};

type CustomDonationInput = {
  onDonate: (amount: number) => void;
};

const CustomDonation = ({ onDonate }: CustomDonationInput) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!ref.current) return;
    onDonate(Math.floor(ref.current.valueAsNumber * 100));
  };

  return (
    <form
      className="flex-1 flex relative rounded-md shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
        <span className="text-gray-500 text-lg">$</span>
      </div>

      <input
        ref={ref}
        type="number"
        name="amount"
        id="amount"
        className="px-3 flex-1 pl-7 border border-gray-300 outline-none rounded-l-md text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:z-10"
        placeholder="50"
        min={3}
        step={0.01}
        required
      />

      <button
        type="submit"
        className="-ml-px px-4 py-2 border border-gray-300 text-lg font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      >
        Donate
      </button>
    </form>
  );
};

type DonationFormProps = {
  onDonate: (amount: number) => void;
};

const DonationForm = ({ onDonate }: DonationFormProps) => {
  const values = [5, 10, 15, 30, 45, 75, 120, 180, 240, 480];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
      <div className="flex-shrink-0">
        <Image src="/pikachu.png" width={240} height={240} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold">Donate today</h2>

        <p className="text-xl mb-2">
          For every <b>$15</b> you contribute to the fundraiser, you will be
          rewarded 1&times; limited-time event Pokémon <b>United Pikachu</b>.
        </p>

        <div className="flex flex-wrap gap-3">
          {values.map((x) => (
            <button
              type="submit"
              className="flex-1 -ml-px px-3 py-2 border border-gray-300 text-lg font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              onClick={() => onDonate(x * 100)}
            >
              {format.format(x)}
            </button>
          ))}

          <CustomDonation onDonate={onDonate} />
        </div>
      </div>
    </div>
  );
};

type HomeProps = {
  currentValue: number;
};

const Home = ({ currentValue }: HomeProps) => {
  const handleDonate = (amount: number) => {
    window.location.href = `/api/checkout?amount=${amount}`;
  };

  return (
    <div className="flex flex-col items-center gap-16 max-w-5xl mx-auto p-6 pb-24">
      <Logos />
      <Text />
      <ProgressBar currentValue={currentValue} />
      <DonationForm onDonate={handleDonate} />
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  return {
    props: {
      currentValue: await fetchValue(),
    },
  };
};
