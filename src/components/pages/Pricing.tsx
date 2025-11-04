"use client";

import { useState } from "react";
import { CheckCheck, X } from "lucide-react";
import { TextAnimate } from "../ui/text-animate";

const Pricing = () => {
  const [billing, setBilling] = useState<"Monthly" | "Yearly">("Monthly");

  const plans = [
    {
      title: "Free",
      price: { Monthly: 0, Yearly: 0 },
      description: "For casual users and testing.",
      features: ["Limited file conversions", "Basic compression", "Standard upscaling"],
      popular: false,
      buttonText: "Sign Up",
    },
    {
      title: "Pro",
      price: { Monthly: 15, Yearly: 150 },
      description: "For professionals and power users.",
      features: ["Unlimited conversions", "Advanced compression", "AI-powered upscaling", "Batch processing"],
      popular: true,
      buttonText: "Get Started",
    },
    {
      title: "Business",
      price: { Monthly: 40, Yearly: 400 },
      description: "For teams and organizations.",
      features: ["All Pro features", "Team accounts", "Priority support", "API access"],
      popular: false,
      buttonText: "Contact Us",
    },
  ];

  return (
    <div className="min-h-screen w-full dark:bg-black py-16 px-20 md:px-10 lg:px-40 font-sans">
      {/* Header */}
      <div className="text-center mb-10">
        <TextAnimate animation="blurInUp" by="word" className="text-3xl md:text-5xl font-black text-[#0f0f0f] dark:text-white mb-2">
          Choose the plan that's right for you.
        </TextAnimate>
        <TextAnimate animation="blurInUp" by="word" className="text-gray-600 dark:text-[#9db0b9] text-base md:text-lg">
          Join our community of happy customers. No credit card required.
        </TextAnimate>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-12">
        <div className="flex h-12 w-full max-w-xs items-center justify-center rounded-lg bg-gray-200 dark:bg-[#0f0f0f]/80 border dark:border-white/10 border-[#0f0f0f] p-1">
          {["Monthly", "Yearly"].map((option) => (
            <label
              key={option}
              className={`flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 text-sm font-medium transition-all
                ${
                  billing === option
                    ? "bg-white dark:bg-white/20 border text-orange-700 border-[#0f0f0f]/30 dark:text-white shadow-[0_0_4px_rgba(0,0,0,0.1)]"
                    : "text-gray-500 dark:text-[#9db0b9]"
                }`}
            >
              <span>{option}</span>
              <input
                type="radio"
                name="billing"
                value={option}
                className="hidden"
                checked={billing === option}
                onChange={() => setBilling(option as "Monthly" | "Yearly")}
              />
            </label>
          ))}
        </div>
      </div>
      

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.title}
            className={`flex flex-col gap-6 rounded-xl p-6 border ${
              plan.popular
                ? "border-2 border-black/10 dark:border-white/10 bg-black/10 dark:bg-white/10 relative"
                : "border-gray-200 border dark:border-white/10 bg-white/10 dark:bg-[#0f0f0f]/80"
            }`}
          >
            {plan.popular && (
              <p className="absolute -top-4 right-6 text-white text-xs font-medium leading-normal tracking-[0.015em] rounded-full bg-orange-500/80 px-3 py-1 text-center">
                Most Popular
              </p>
            )}

            <div className="flex flex-col gap-2">
              <h3 className="text-[#0f0f0f] dark:text-white text-xl font-bold">
                {plan.title}
              </h3>
              <p className="text-gray-500 dark:text-white/50">{plan.description}</p>
              <p className="flex items-baseline gap-1 text-[#0f0f0f] dark:text-white">
                <span className="text-4xl font-black tracking-[-0.033em]">
                  ${plan.price[billing]}
                </span>
                <span className="text-base font-bold">/{billing.toLowerCase()}</span>
              </p>
            </div>

            <button
              className={` cursor-pointer flex min-w-[84px] max-w-full items-center justify-center h-10 px-4 rounded-lg text-sm font-bold tracking-[0.015em]  transition-all active:scale-95
                ${
                  plan.popular
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-gray-200 dark:bg-[#283339] text-[#0f0f0f]/80 dark:text-white hover:bg-gray-300 dark:hover:bg-[#3b4b54]"
                }`}
            >
              {plan.buttonText}
            </button>

            <div className="flex flex-col gap-3 mt-2">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="text-[13px] font-normal leading-normal flex gap-3 items-center text-gray-700 dark:text-white"
                >
                  <CheckCheck />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
