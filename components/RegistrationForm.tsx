"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const DISCLAIMER_TEXT = `Strategy Fundamentals is a newsletter and informational service only. All content, including trade ideas, strategies, and performance metrics, is provided for informational purposes and does not constitute investment advice, financial advice, or trading advice. Strategy Fundamentals is not responsible for any trading decisions you make or any financial outcomes that result from your use of this service. Trading involves significant risk and you may lose your entire investment. Past performance is not indicative of future results.`;

interface RegistrationFormProps {
  marketingParams?: string;
}

export function RegistrationForm({ marketingParams }: RegistrationFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !disclaimerAccepted) {
      setError("Please fill in all fields and accept the disclaimer.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    // Build the thank-you URL with registration data
    const thankYouParams = new URLSearchParams();
    thankYouParams.set("email", email);
    thankYouParams.set("password", password);
    thankYouParams.set("register", "true");
    
    // Append marketing params if present
    if (marketingParams) {
      const existingParams = new URLSearchParams(marketingParams);
      existingParams.forEach((value, key) => {
        thankYouParams.set(key, value);
      });
    }

    // Redirect to thank-you page which will handle the registration
    router.push(`/thank-you?${thankYouParams.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Create password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 6 characters"
          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          disabled={isSubmitting}
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Legal Disclaimer
        </p>
        <p className="text-xs leading-relaxed text-slate-600">
          {DISCLAIMER_TEXT}
        </p>
        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={disclaimerAccepted}
            onChange={(e) => setDisclaimerAccepted(e.target.checked)}
            required
            disabled={isSubmitting}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-slate-700">
            I have read and accept the legal disclaimer above
          </span>
        </label>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:from-indigo-700 hover:via-fuchsia-600 hover:to-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Starting trial...
          </>
        ) : (
          "Start Free Trial"
        )}
      </button>

      <p className="text-center text-xs text-slate-500">
        No credit card required • Cancel anytime
      </p>
    </form>
  );
}
