"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Script from "next/script";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const DEFAULT_NEXT_URL = "https://www.strategyfundamentals.com";
const ALLOWED_NEXT_HOSTS = new Set([
  "strategyfundamentals.com",
  "www.strategyfundamentals.com"
]);

// TODO: Replace with your real Google Ads conversion ID and label.
const GOOGLE_ADS_CONVERSION_ID = "AW-123456789";
const GOOGLE_ADS_CONVERSION_LABEL = "AbCDefGhIjkLmNoPqRs";
const CONVERSION_SESSION_KEY = "sf_google_ads_conversion_fired";

const MIN_LOADING_TIME = 1000; // Minimum 1 second on loading page

const toSearchParams = (
  params: Record<string, string | string[] | undefined>
) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        search.append(key, item);
      });
      return;
    }
    search.append(key, value);
  });
  return search;
};

const isAllowedNextUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === "https:" && ALLOWED_NEXT_HOSTS.has(parsed.hostname)
    );
  } catch {
    return false;
  }
};

const mergeQueryParams = (
  nextUrl: string,
  forwardParams: URLSearchParams
) => {
  const mergedUrl = new URL(nextUrl);
  forwardParams.forEach((value, key) => {
    if (!mergedUrl.searchParams.has(key)) {
      mergedUrl.searchParams.append(key, value);
    }
  });
  return mergedUrl.toString();
};

export default function ThankYouClient({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const redirectTimeoutRef = useRef<number | null>(null);
  const redirectedRef = useRef(false);
  const registrationAttemptedRef = useRef(false);

  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const normalizedParams = useMemo(() => toSearchParams(searchParams), [searchParams]);
  
  // Check if this is a registration flow
  const isRegistrationFlow = normalizedParams.get("register") === "true";
  const email = normalizedParams.get("email");
  const password = normalizedParams.get("password");

  const destinationUrl = useMemo(() => {
    const requestedNext = normalizedParams.get("next") ?? DEFAULT_NEXT_URL;
    const safeNext = isAllowedNextUrl(requestedNext)
      ? requestedNext
      : DEFAULT_NEXT_URL;

    // Create a copy of params without sensitive data
    const forwardParams = new URLSearchParams();
    normalizedParams.forEach((value, key) => {
      // Don't forward sensitive or registration-specific params
      if (!["next", "email", "password", "register"].includes(key)) {
        forwardParams.append(key, value);
      }
    });

    return mergeQueryParams(safeNext, forwardParams);
  }, [normalizedParams]);

  // Registration handler
  const performRegistration = useCallback(async () => {
    if (!email || !password) {
      setRegistrationError("Missing registration details.");
      return null;
    }

    setIsRegistering(true);
    setRegistrationError(null);

    const startTime = Date.now();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          disclaimerAccepted: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Ensure minimum time on loading page
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_LOADING_TIME) {
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsed));
      }

      setRegistrationSuccess(true);
      return data.loginUrl;

    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : "Registration failed");
      setIsRegistering(false);
      return null;
    }
  }, [email, password]);

  // Handle registration flow
  useEffect(() => {
    if (!isRegistrationFlow || registrationAttemptedRef.current) return;
    registrationAttemptedRef.current = true;

    const handleRegistration = async () => {
      const loginUrl = await performRegistration();
      if (loginUrl) {
        // Redirect to the login URL from the API
        window.location.assign(loginUrl);
      }
    };

    handleRegistration();
  }, [isRegistrationFlow, performRegistration]);

  // Handle non-registration flow (legacy redirect)
  useEffect(() => {
    if (isRegistrationFlow || redirectedRef.current) return;

    redirectedRef.current = true;
    redirectTimeoutRef.current = window.setTimeout(() => {
      window.location.assign(destinationUrl);
    }, MIN_LOADING_TIME);

    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [destinationUrl, isRegistrationFlow]);

  // Fire conversion tracking
  useEffect(() => {
    const session = window.sessionStorage;
    if (session.getItem(CONVERSION_SESSION_KEY)) {
      return;
    }

    session.setItem(CONVERSION_SESSION_KEY, "true");

    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: `${GOOGLE_ADS_CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
        value: 0.0,
        currency: "USD"
      });
    }
  }, []);

  // Retry registration
  const handleRetry = () => {
    registrationAttemptedRef.current = false;
    setRegistrationError(null);
    performRegistration().then(loginUrl => {
      if (loginUrl) {
        window.location.assign(loginUrl);
      }
    });
  };

  // Error state
  if (registrationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 px-6 py-16 text-slate-900">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_CONVERSION_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_CONVERSION_ID}');
          `}
        </Script>

        <div className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-3xl border border-white/70 bg-white/80 p-10 text-center shadow-soft backdrop-blur">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <svg className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent-600">
            Strategy Fundamentals
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Something went wrong
          </h1>
          <p className="mt-4 text-base text-slate-600">
            {registrationError}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleRetry}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:from-indigo-700 hover:via-fuchsia-600 hover:to-rose-600"
            >
              Try Again
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Loading/success state for registration flow
  if (isRegistrationFlow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 px-6 py-16 text-slate-900">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_CONVERSION_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_CONVERSION_ID}');
          `}
        </Script>

        <div className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-3xl border border-white/70 bg-white/80 p-10 text-center shadow-soft backdrop-blur">
          {/* Animated loading spinner */}
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-600"></div>
            {registrationSuccess && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-10 w-10 text-emerald-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-accent-600">
            Strategy Fundamentals
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
            {registrationSuccess ? "Account created!" : "Preparing your dashboard"}
          </h1>
          <p className="mt-4 text-base text-slate-600">
            {registrationSuccess
              ? "Redirecting you to your dashboard now..."
              : isRegistering
                ? "Setting up your free trial account..."
                : "Please wait while we get everything ready..."}
          </p>

          {/* Progress indicator dots */}
          <div className="mt-8 flex gap-2">
            <div className={`h-2 w-2 rounded-full ${isRegistering || registrationSuccess ? 'bg-indigo-600' : 'bg-indigo-200'} transition-colors`}></div>
            <div className={`h-2 w-2 rounded-full ${registrationSuccess ? 'bg-indigo-600' : 'bg-indigo-200'} transition-colors`}></div>
            <div className={`h-2 w-2 rounded-full ${registrationSuccess ? 'bg-indigo-600' : 'bg-indigo-200'} transition-colors`}></div>
          </div>

          <p className="mt-8 text-xs text-slate-500">
            You will be automatically redirected in a moment.
          </p>
        </div>
      </div>
    );
  }

  // Legacy non-registration flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 px-6 py-16 text-slate-900">
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_CONVERSION_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);} 
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_CONVERSION_ID}');
        `}
      </Script>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-3xl border border-white/70 bg-white/80 p-10 text-center shadow-soft backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-600">
          Strategy Fundamentals
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
          Thanks - you are almost in.
        </h1>
        <p className="mt-4 text-base text-slate-600">
          Redirecting you to start your free trial...
        </p>
        <a
          href={destinationUrl}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:from-indigo-700 hover:via-fuchsia-600 hover:to-rose-600"
        >
          Continue to Free Trial
        </a>
        <p className="mt-4 text-xs text-slate-500">
          If you are not redirected automatically, click the button.
        </p>
      </div>
    </div>
  );
}
