import { GetServerSideProps } from "next";
import { HiChevronLeft } from "react-icons/hi";
import Stripe from "stripe";
import Logos from "../components/Logos";
import { stripe } from "../lib/stripe";

const format = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type SuccessProps = {
  session: Stripe.Checkout.Session;
};

const Success = ({ session }: SuccessProps) => {
  return (
    <div className="flex flex-col items-center gap-4 max-w-3xl mx-auto p-6 pb-24 text-center">
      <Logos />
      <p className="text-xl">
        Thanks for contributing{" "}
        <b>{format.format((session.amount_total ?? 0) / 100)}</b> to our
        Thanksgiving fundraiser for{" "}
        <a
          href="https://www.msf.org/"
          className="text-blue-800 hover:underline"
        >
          Médecins Sans Frontières / Doctors Without Borders
        </a>
        ! Your charitable donation is greatly appreciated. 100% of your donation
        will be donated to the charity, and Pokétwo will cover all transaction
        fees associated with the payment.
      </p>
      <p className="text-xl">
        A receipt has been sent to <b>{session.customer_details?.email}</b>. For
        any questions or concerns, please contact Oliver#0001 on Discord.
      </p>
      <p className="text-xl">
        <a href="/" className="text-blue-800 hover:underline flex items-center">
          <HiChevronLeft className="text-2xl" />
          Back to Main Fundraiser Page
        </a>
      </p>
    </div>
  );
};

export default Success;

export const getServerSideProps: GetServerSideProps<SuccessProps> = async ({
  query: { session_id },
}) => {
  if (typeof session_id !== "string") return { notFound: true };
  const session = await stripe.checkout.sessions.retrieve(session_id);
  return { props: { session } };
};
