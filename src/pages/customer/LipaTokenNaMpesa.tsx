import { useState, useEffect, FormEvent } from "react";
import api from "@/lib/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Gauge, Loader2, Smartphone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/assets/icon-1.png"

const LipaTokenNaMpesa = () => {
  const { user } = useAuth();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ phone?: string; amount?: string; meterNumber?: string }>({});
  const [showBubbles, setShowBubbles] = useState(false);

  const MySwal = withReactContent(Swal);

  // Auto-fetch meter number for customers
  useEffect(() => {
    if (user && user.role === 'customer') {
      api.get("/admin/me")
        .then(res => {
          const meter = res.data.user?.meter;
          if (meter && meter.meter_number) {
            setMeterNumber(meter.meter_number);
          }
          if (res.data.user?.phone) {
            let displayPhone = res.data.user.phone;
            if (displayPhone.startsWith('254')) {
              displayPhone = '0' + displayPhone.slice(3);
            }
            setPhone(displayPhone);
          }
        })
        .catch(err => console.error("Failed to fetch customer details", err));
    }
  }, [user]);

  const validateInputs = () => {
    const errors: { phone?: string; amount?: string; meterNumber?: string } = {};

    if (!/^(01|07)\d{8}$/.test(phone)) {
      errors.phone = "Enter valid phone number (0712345678)";
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      errors.amount = "Enter valid amount";
    }

    if (!meterNumber || meterNumber.trim().length < 5) {
      errors.meterNumber = "Enter a valid meter number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const startPolling = (checkoutRequestId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 60 seconds (2s interval)

    const interval = setInterval(async () => {
      attempts++;

      try {
        const response = await api.get(`/mpesa/query/${checkoutRequestId}`);
        const { status, amount: paidAmount, result_desc } = response.data;

        if (status === "confirmed") {
          clearInterval(interval);
          Swal.close();
          MySwal.fire({
            icon: "success",
            title: "Payment Successful",
            text: `KES ${paidAmount} received for Meter: ${meterNumber}`
          });
          setShowBubbles(false);
        } else if (status === "failed") {
          clearInterval(interval);
          Swal.close();
          MySwal.fire({
            icon: "error",
            title: "Payment Failed",
            text: result_desc || "Transaction failed"
          });
          setShowBubbles(false);
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          Swal.close();
          Swal.fire({
            icon: "info",
            title: "Payment Pending",
            text: "We haven't received confirmation yet. Please check your SMS shortly."
          });
          setShowBubbles(false);
        }
      } catch (error) {
        console.error("Polling error", error);
        // Continue polling unless it's a critical error
      }
    }, 2000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});
    if (!validateInputs()) return;

    setLoading(true);

    try {
      const formattedPhone = "254" + phone.slice(-9);
      const numericAmount = Number(amount);

      MySwal.fire({
        title: "Processing Payment",
        text: "Sending M-Pesa prompt...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const response = await api.post("/mpesa/stkpush", {
        phone: formattedPhone,
        amount: numericAmount,
        reference: meterNumber
      });

      const { CheckoutRequestID } = response.data || {};

      if (CheckoutRequestID) {
        setShowBubbles(true);
        startPolling(CheckoutRequestID);
      } else {
        throw new Error("Missing CheckoutRequestID");
      }

      setPhone("");
      setAmount("");

    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Unable to initiate payment. Please try again later.';
      Swal.fire({
        title: 'Payment Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#10b981',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-950 transition">

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">

        {/* Logo */}

        <div className="text-center mb-8">

          <img
            src={Logo}
            draggable={false}
            alt="Logo"
            className="h-14 mx-auto mb-4"
          />

          <h1 className="text-3xl font-bold text-[#0A1F44] dark:text-white">
            Lipia Token na M-Pesa
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Enter your details to receive a payment prompt
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Phone */}

          <div>

            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              M-Pesa Phone to receive prompt
            </label>

            <div className="relative">

              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>

              <input
                type="tel"
                placeholder="0712345678"
                value={phone}
                onChange={(e)=>setPhone(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:text-white transition focus:ring-2 focus:ring-[#0A1F44]
                ${validationErrors.phone ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
                disabled={loading}
              />

            </div>

            {validationErrors.phone && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.phone}</p>
            )}

          </div>

          {/* Meter Number */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Meter Number
            </label>
            <div className="relative">
              <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
              <input
                type="text"
                placeholder="14123456789"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:text-white transition focus:ring-2 focus:ring-[#0A1F44]
                ${validationErrors.meterNumber ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
                readOnly={true}
                disabled={loading}
              />
            </div>
            {validationErrors.meterNumber && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.meterNumber}</p>
            )}
          </div>

          {/* Amount */}

          <div>

            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Amount (KES)
            </label>

            <div className="relative">

              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                KSh
              </span>

              <input
                type="number"
                placeholder="100"
                value={amount}
                onChange={(e)=>setAmount(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 dark:text-white transition focus:ring-2 focus:ring-[#0A1F44]
                ${validationErrors.amount ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
                disabled={loading}
              />

            </div>

            {validationErrors.amount && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.amount}</p>
            )}

          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 font-semibold text-white bg-[#0A1F44] hover:bg-[#081735] rounded-xl transition disabled:opacity-50"
          >

            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin"/>
                Processing...
              </>
            ) : (
              `Pay KES ${Number(amount) || 0}`
            )}

          </button>

        </form>

        {/* Animated waiting bubbles */}

        {showBubbles && (
          <div className="mt-8 flex justify-center">

            <div className="flex space-x-2">

              <span className="w-4 h-4 bg-green-500 rounded-full animate-bounce"/>
              <span className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-100"/>
              <span className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce delay-200"/>
              <span className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-300"/>
              <span className="w-4 h-4 bg-purple-500 rounded-full animate-bounce delay-500"/>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default LipaTokenNaMpesa;