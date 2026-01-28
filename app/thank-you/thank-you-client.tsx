"use client";

import { useEffect, useMemo, useRef } from "react";
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

  const destinationUrl = useMemo(() => {
    const normalizedParams = toSearchParams(searchParams);
    const requestedNext = normalizedParams.get("next") ?? DEFAULT_NEXT_URL;
    const safeNext = isAllowedNextUrl(requestedNext)
      ? requestedNext
      : DEFAULT_NEXT_URL;

    normalizedParams.delete("next");

    return mergeQueryParams(safeNext, normalizedParams);
  }, [searchParams]);

  useEffect(() => {
    if (redirectedRef.current) return;

    redirectedRef.current = true;
    redirectTimeoutRef.current = window.setTimeout(() => {
      window.location.assign(destinationUrl);
    }, 1000);

    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [destinationUrl]);

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
          Thanks — you’re almost in.
        </h1>
        <p className="mt-4 text-base text-slate-600">
          Redirecting you to start your free trial…
        </p>
        <a
          href={destinationUrl}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:from-indigo-700 hover:via-fuchsia-600 hover:to-rose-600"
        >
          Continue to Free Trial
        </a>
        <p className="mt-4 text-xs text-slate-500">
          If you aren’t redirected automatically, click the button.
        </p>
      </div>
    </div>
  );
}
