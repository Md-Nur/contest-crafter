import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useAxiosSecure } from "../hook/axios";
import { useUserAuth } from "../contexts/UserAuthProvider";
import { useNavigate, useParams } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISH_KEY);

const CheckoutForm = ({ amount, clientSecret, contestId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { userAuth } = useUserAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  //   console.log(clientSecret);

  const handleSubmit = async (event) => {
    event.preventDefault();
    Swal.fire({
      title: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);

    if (card == null) return;

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    } else {
      //   console.log("[PaymentMethod]", paymentMethod);
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: userAuth.displayName || "Anonymous",
            email: userAuth.email || "Anonymous",
          },
        },
      });

    if (confirmError) {
      console.log("[error]", confirmError);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: confirmError.message,
      });
    } else if (paymentIntent.status === "succeeded") {
      //   console.log("[PaymentIntent]", paymentIntent);
      await axiosSecure.post("/payment-success", {
        paymentIntent,
        userId: userAuth._id,
        contestId: contestId,
      });

      Swal.fire({
        icon: "success",
        title: "Payment Success",
        text: paymentIntent.description,
      });
      navigate(`/contest/${contestId}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full justify-center items-center max-w-md mx-auto my-10"
    >
      <span className="text-center">You have to pay: ${amount}</span>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
        className="border border-base-content p-2 rounded-md w-full"
      />
      <button
        className="btn btn-secondary w-20"
        type="submit"
        disabled={!stripe || !clientSecret}
      >
        Pay
      </button>
    </form>
  );
};
const Payment = () => {
  const params = useParams();

  const [clientSecret, setClientSecret] = useState("");

  const axiosSecure = useAxiosSecure();

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    axiosSecure.get(`/contest/${params.contestId}`).then((res) => {
      setAmount(res.data.regFee);
      axiosSecure
        .post("/create-payment-intent", {
          price: res.data.regFee,
        })
        .then((res) => setClientSecret(res.data.clientSecret));
    });
  }, [axiosSecure, params.contestId]);
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="w-full">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            amount={amount}
            contestId={params.contestId}
            clientSecret={clientSecret}
          />
        </Elements>
      )}
    </div>
  );
};

export default Payment;
