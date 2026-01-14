"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

const PRICING = {
  trialPrice: "$0 / 14 days",
  bundlePrice: "$29 / month"
};

const CHECKOUT_LINKS = {
  trial: "#",
  bundle: "#"
};

const trustBullets = [
  "Rules-based signals",
  "Dashboard + push notifications",
  "Transparent methodology"
];

const logoPlaceholders = [
  "Momentum Desk",
  "EquityForge",
  "SignalStack",
  "MarketLens",
  "QuantPath"
];

const steps = [
  {
    title: "Pick a strategy bundle or watchlist",
    description:
      "Choose the rule sets and watchlists that align with your timeframe and market focus."
  },
  {
    title: "Receive dashboard signals + push alerts",
    description:
      "Get notified when a setup meets the historical rules. PWA + push notifications supported."
  },
  {
    title: "Review & decide",
    description:
      "You control your trades. Use the context and risk notes to make your own decisions."
  }
];

const featureCards = [
  {
    title: "Curated stock watchlists",
    description: "Stay focused on the tickers and themes most relevant to each strategy."
  },
  {
    title: "Rule-based entries/exits",
    description:
      "Clear historical criteria help you understand what triggers each signal."
  },
  {
    title: "Real-time dashboard updates",
    description:
      "Watch signals update throughout the session with concise, contextual status labels."
  },
  {
    title: "Push notifications",
    description: "Desktop + mobile PWA alerts keep you on top of new setups."
  },
  {
    title: "Simple onboarding",
    description: "Start with a guided setup and quick-start walkthroughs."
  },
  {
    title: "Risk notes & trade-plan context",
    description:
      "Every setup includes considerations to keep risk in view before you act."
  }
];

const faqs = [
  {
    question: "Is this financial advice?",
    answer:
      "No. Strategy Fundamentals is an educational newsletter and dashboard. We share historical strategy rules and signals for informational purposes only."
  },
  {
    question: "What are push notifications and how do I enable them?",
    answer:
      "Push notifications are real-time alerts delivered through your browser or PWA. You can enable them during onboarding or from your dashboard settings."
  },
  {
    question: "What does “backtested” mean?",
    answer:
      "Backtested strategies are evaluated on historical data to understand how the rules performed in the past. Historical results are not indicative of future outcomes."
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel or change your plan from your account settings at any time."
  },
  {
    question: "Do you execute trades for me?",
    answer:
      "No. We provide signals and context, but you decide if and when to place any trades."
  },
  {
    question: "What markets/timeframes does this cover?",
    answer:
      "We focus on U.S. equities with multiple timeframes, from intraday to swing setups. Coverage evolves as new strategy bundles are added."
  }
];

const pricingDetails = [
  "Full dashboard access",
  "Email newsletter + alerts",
  "Strategy bundle updates",
  "Onboarding support"
];

const signals = [
  {
    symbol: "AAPL",
    setup: "Breakout continuation",
    trigger: "Above 50-day range",
    risk: "Earnings in 8 days",
    status: "Watching"
  },
  {
    symbol: "NVDA",
    setup: "Pullback reset",
    trigger: "VWAP reclaim",
    risk: "Wide ATR",
    status: "Alert sent"
  },
  {
    symbol: "MSFT",
    setup: "Trend squeeze",
    trigger: "Higher low",
    risk: "Sector rotation",
    status: "Watching"
  },
  {
    symbol: "TSLA",
    setup: "Gap fill",
    trigger: "Open range hold",
    risk: "High beta",
    status: "Alert sent"
  }
];

export default function Home() {
  const [formState, setFormState] = useState({ name: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = useMemo(() => {
    if (!formState.email) {
      return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email);
  }, [formState.email]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formState.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState)
      });

      if (!response.ok) {
        throw new Error("Unable to submit form");
      }

      setStatus("success");
      setFormState({ name: "", email: "" });
    } catch (submitError) {
      console.error(submitError);
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <Container className="flex items-center justify-between py-4">
          <div className="text-lg font-semibold text-slate-900">
            Strategy Fundamentals
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a className="hover:text-slate-900" href="#how-it-works">
              How it Works
            </a>
            <a className="hover:text-slate-900" href="#dashboard">
              Dashboard
            </a>
            <a className="hover:text-slate-900" href="#alerts">
              Alerts
            </a>
            <a className="hover:text-slate-900" href="#pricing">
              Pricing
            </a>
            <a className="hover:text-slate-900" href="#faq">
              FAQ
            </a>
          </nav>
          <Link
            href={CHECKOUT_LINKS.trial}
            className="rounded-full bg-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-700"
          >
            Start Free Trial
          </Link>
        </Container>
      </header>

      <main>
        <section className="pb-20 pt-16 sm:pt-20">
          <Container className="fade-up grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-600">
                Strategy Fundamentals
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                Stock trade ideas powered by rules-based backtests — delivered to
                your dashboard + push alerts.
              </h1>
              <p className="mt-5 text-lg text-slate-600">
                Follow a simple workflow: browse backtested strategy rules, monitor
                a live dashboard, and receive push notifications when setups
                trigger. Transparent methodology built for clarity and control.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={CHECKOUT_LINKS.trial}
                  className="rounded-full bg-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-700"
                >
                  Start Free Trial
                </Link>
                <a
                  href="#how-it-works"
                  className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  See How It Works
                </a>
              </div>
              <div className="mt-8 flex flex-col gap-2 text-sm text-slate-600">
                {trustBullets.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-accent-500"></span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-soft">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    Today&apos;s Signals
                  </p>
                  <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
                    Live dashboard
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  {signals.slice(0, 3).map((signal) => (
                    <div
                      key={signal.symbol}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">
                          {signal.symbol}
                        </p>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {signal.status === "Alert sent"
                            ? "Push alert sent"
                            : "Watching"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {signal.setup} • {signal.trigger}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Risk note: {signal.risk}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs text-slate-500">
                  Educational signals only. No investment advice.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-8">
          <Container className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm font-semibold text-slate-600">
              Trusted by active traders
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-400">
              {logoPlaceholders.map((logo) => (
                <span key={logo}>{logo}</span>
              ))}
            </div>
          </Container>
        </section>

        <section id="how-it-works" className="py-20">
          <Container>
            <SectionHeading
              eyebrow="How it works"
              title="A transparent workflow designed for clarity"
              description="Pick the strategies you want to follow, receive alerts, and review each setup with full context before deciding how to act."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-50 text-sm font-semibold text-accent-700">
                    0{index + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="dashboard" className="bg-slate-50 py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div className="flex flex-col justify-center">
                <SectionHeading
                  eyebrow="Dashboard preview"
                  title="Everything in one signal-focused workspace"
                  description="Track active setups, review risk notes, and see alert status in one glance. Designed for fast decisions and clean data hygiene."
                />
                <div className="mt-6 rounded-2xl border border-accent-100 bg-accent-50/60 p-4 text-sm text-accent-700">
                  PWA + push notifications supported for desktop and mobile alerts.
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                  <span>Signals dashboard</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Live
                  </span>
                </div>
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-[1fr_1.5fr_1.5fr_1.5fr_1fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span>Symbol</span>
                    <span>Setup</span>
                    <span>Trigger</span>
                    <span>Risk notes</span>
                    <span>Status</span>
                  </div>
                  <div className="divide-y divide-slate-200 text-sm">
                    {signals.map((signal) => (
                      <div
                        key={signal.symbol}
                        className="grid grid-cols-[1fr_1.5fr_1.5fr_1.5fr_1fr] gap-3 px-4 py-4"
                      >
                        <span className="font-semibold text-slate-900">
                          {signal.symbol}
                        </span>
                        <span className="text-slate-600">{signal.setup}</span>
                        <span className="text-slate-600">{signal.trigger}</span>
                        <span className="text-slate-500">{signal.risk}</span>
                        <span className="text-xs font-semibold text-emerald-700">
                          {signal.status === "Alert sent" ? "Push alert sent" : "Watching"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  Illustrative dashboard layout. Educational signals only.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section id="alerts" className="py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <SectionHeading
                  eyebrow="Alerts"
                  title="Push notifications that keep you aligned with the rules"
                  description="Enable desktop or mobile PWA alerts to stay informed when a setup hits its historical trigger. You stay in control of every trade decision."
                />
                <p className="mt-6 text-sm text-slate-600">
                  PWA + push notifications supported. Alerts are informational and
                  do not constitute investment advice.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">
                      Alert Center
                    </p>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Push alert sent
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    NVDA • Pullback reset • VWAP reclaim triggered
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Rule-based alert. Review risk notes before acting.
                  </p>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Daily digest</span>
                    <span className="font-semibold text-accent-600">Scheduled</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Summary email with setups, watchlists, and risk context.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="backtesting" className="py-20">
          <Container>
            <SectionHeading
              eyebrow="Backtesting clarity"
              title="Backtested strategy rules with transparent context"
              description="We test strategy rules on historical data to help you understand how setups behaved in the past. No promises, just disciplined analysis."
              align="center"
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { label: "Win rate", value: "Example / Illustrative" },
                { label: "Avg. hold time", value: "Example / Illustrative" },
                { label: "Max drawdown", value: "Example / Illustrative" }
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-soft"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-4 text-lg font-semibold text-slate-900">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">Example backtest metric</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm font-semibold text-slate-500">
              Historical results do not guarantee future performance.
            </p>
          </Container>
        </section>

        <section className="bg-slate-50 py-20">
          <Container>
            <SectionHeading
              eyebrow="Features"
              title="Everything you need to stay disciplined"
              description="A streamlined dashboard, clear signals, and context-rich notes to help you keep your process consistent."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="pricing" className="py-20">
          <Container>
            <SectionHeading
              eyebrow="Pricing"
              title="Start with a free trial, then unlock full bundles"
              description="Choose the plan that fits your workflow. Cancel anytime."
              align="center"
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Trial
                </p>
                <p className="mt-4 text-4xl font-semibold text-slate-900">
                  {PRICING.trialPrice}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Explore the dashboard, alerts, and daily summary.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {pricingDetails.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-accent-500"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={CHECKOUT_LINKS.trial}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Start Free Trial
                </Link>
              </div>
              <div className="rounded-3xl border border-accent-200 bg-white p-8 shadow-soft">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-600">
                    Bundle
                  </p>
                  <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
                    Most popular
                  </span>
                </div>
                <p className="mt-4 text-4xl font-semibold text-slate-900">
                  {PRICING.bundlePrice}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Full access to all strategy bundles and priority alerts.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {[...pricingDetails, "Priority push notifications"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-accent-500"></span>
                        {item}
                      </li>
                    )
                  )}
                </ul>
                <Link
                  href={CHECKOUT_LINKS.bundle}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-700"
                >
                  Subscribe to Bundle
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section id="faq" className="bg-slate-50 py-20">
          <Container>
            <SectionHeading
              eyebrow="FAQ"
              title="Answers to common questions"
              description="Still deciding? These are the most frequent questions from new members."
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="text-base font-semibold text-slate-900">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-soft lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-600">
                    Ready to start?
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
                    Get the newsletter + dashboard access today
                  </h2>
                  <p className="mt-4 text-base text-slate-600">
                    Join Strategy Fundamentals for educational signals, dashboard
                    alerts, and transparent historical strategy rules. No
                    recommendations — just clear setups you can evaluate.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          name: event.target.value
                        }))
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-100"
                      placeholder="Taylor"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          email: event.target.value
                        }))
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-100"
                      placeholder="you@company.com"
                    />
                  </div>
                  {error ? (
                    <p className="text-sm font-semibold text-rose-600">{error}</p>
                  ) : null}
                  {status === "success" ? (
                    <p className="text-sm font-semibold text-emerald-600">
                      Success! Check your inbox for next steps.
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex w-full items-center justify-center rounded-full bg-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "loading" ? "Submitting..." : "Get Started"}
                  </button>
                  <p className="text-xs text-slate-500">
                    We&apos;ll only use your email to send educational updates.
                  </p>
                </form>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <Container>
          <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-center">
            <div>
              <p className="text-lg font-semibold text-slate-900">
                Strategy Fundamentals
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Educational newsletter + dashboard for backtested strategy rules.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
              <a href="#" className="hover:text-slate-900">
                Terms
              </a>
              <a href="#" className="hover:text-slate-900">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-900">
                Disclosures
              </a>
            </div>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Strategy Fundamentals is for educational and informational purposes
            only and does not provide financial advice. All signals, trade ideas,
            and strategy rules are based on historical data and are not
            guarantees of future results. You are solely responsible for your
            own trading decisions. Historical backtests are not indicative of
            future performance.
          </p>
        </Container>
      </footer>
    </div>
  );
}
